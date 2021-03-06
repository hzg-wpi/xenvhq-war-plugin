import {Application, WaltzWidget} from "@waltz-controls/middleware";
import {kWidgetXenvHq, XenvHqWidget} from "index";
import {kUserContext, UserContext} from "@waltz-controls/waltz-user-context-plugin";
import {TangoRestController, TangoSubscriptionsController} from "@waltz-controls/waltz-tango-rest-plugin";

const kDummyUser = {
    name: 'tango-cs',
    headers: {
        "Authorization": "Basic " + btoa("tango-cs:tango")
    }
};

class DummyUserContext extends UserContext {
    constructor() {
        super({
            user: 'tango-cs', tango_hosts: {}, device_filters: [], ext: {
                [kWidgetXenvHq]: [
                    {
                        id: "localhost:10000/development/xenv/hq",
                        name: "HeadQuarter",
                        state: "UNKNOWN",
                        status: "Not initialized"
                    },
                    {
                        id: "localhost:10000/development/xenv/config",
                        name: "ConfigurationManager",
                        state: "UNKNOWN",
                        status: "Not initialized"
                    },
                    {
                        id: "localhost:10000/development/xenv/manager",
                        name: "XenvManager",
                        state: "UNKNOWN",
                        status: "Not initialized"
                    }
                ]
            }
        });
    }


    save(host = '', options = {}) {
        return Promise.resolve(42);
    }
}

class MainWidget extends WaltzWidget {
    constructor(app) {
        super("widget:main", app);
    }


    run() {
        this.mainView = webix.ui({
            view: 'tabview',
            cells: [{}]
        });
    }
}

const waltz = new Application({name: APPNAME, version: VERSION})
    .registerContext('user', kDummyUser)
    .registerContext(kUserContext, new DummyUserContext())
    .registerController(application => new TangoRestController(application))
    .registerController(application => new TangoSubscriptionsController(application))
    .registerWidget(application => new MainWidget(application))
    .registerWidget(application => new XenvHqWidget(application))
    .run()
