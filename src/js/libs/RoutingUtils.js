'use strict';

define(['ojs/ojcore'],
    function (oj) {

        function RoutingUtils() {
            let self = this;
            //Array of routers
            self._routers = [];
            //Root OJET router instance.
            self._rootRouter = oj.Router.rootInstance;

            /**
             * Parse all configured routers and create Promises for handling missing states, refresh observable
             * values from the routers.
             * @returns an array of Promises for each defined router;
             */
            self._handleMissingStates = function () {
                let _routersPromises = [];
                //Go through all routers and create a promise to change the observable attached to the router;
                for (let rout = 0; rout < self._routers.length; rout++) {
                    _routersPromises[rout] = new Promise((resolve) => {
                        let _stateId = undefined;
                        let _router = self._routers[rout];
                        if (_router.childRouter !== undefined) {
                            //Get the router state and set the value to the observable, handler specific for numeric value
                            _stateId = _router.childRouter.stateId();
                            if (_stateId !== undefined) {
                                if (_router.type === 'int') {
                                    _router.observable(parseInt(_stateId));
                                } else {
                                    _router.observable(_stateId);
                                }
                            }
                        }
                        resolve(_stateId);
                    });
                }
                return Promise.all(_routersPromises);
            };

            /**
             * Initialize routers, go through all configured routers and create OJET child router.
             * @param routers the list of configured routers along whith the associated observable;
             * @returns a list of Promises that creates the child routers.
             */
            self.initRouters = function (routers) {
                self._routers = routers;
                let _routersPromises = [];
                for (let rout = 0; rout < self._routers.length; rout++) {
                    _routersPromises[rout] = new Promise((resolve) => {
                        let _router = self._routers[rout];
                        if (rout === 0) {
                            _router.childRouter = self._rootRouter.getChildRouter(_router.name);

                            if (_router.childRouter === undefined) {
                                let rootStateId = self._rootRouter.currentState().id;
                                _router.childRouter = self._rootRouter.createChildRouter(_router.name, rootStateId);
                            }
                        } else {
                            let _prevRouter = self._routers[rout - 1];
                            _router.childRouter = _prevRouter.childRouter.getChildRouter(_router.name);
                            if (_router.childRouter === undefined) {
                                _router.childRouter = _prevRouter.childRouter.createChildRouter(_router.name);
                            }
                        }

                        _router.childRouter.configure((routId) => {
                            if (routId) {
                                return new oj.RouterState(routId, self.childRouter);
                            }
                            return null;
                        });
                        resolve();
                    });
                }
                return Promise.all(_routersPromises)
                .then(oj.Router.sync);//Sync the routing

            };

            self.go = function (valuesArray) {
                if (self._routers.length > 0) {
                    self._routers[0].childRouter.go(valuesArray, {historyUpdate: 'replace'});
                }
            };

            oj.Router.transitionedToState.add((event) => {
                if (event.hasChanged) {
                    return self._handleMissingStates();
                }
            });

        }

        return new RoutingUtils();
    });

