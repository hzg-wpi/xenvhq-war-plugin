import {codemirror_textarea} from "@waltz-controls/waltz-webix-extensions";
import 'codemirror/mode/xml/xml.js';

import {newXenvMainBody} from "./xenv_hq_main_view.js";
import {newDataSourcesBody} from "./xenv_datasources_view.js";
import {kXenvHqPanelId, kXenvLeftPanel} from "./index";

const xml = webix.protoUI({
    name: "xml",
    update(value){
        if (!value || !this.editor) return;
        this.setValue(value);
    }
},codemirror_textarea);

export function newXmlView(){
    return {
        gravity: 2,
        rows: [
            {
                view: "xml",
                id: "xml",
                mode: "application/xml",
                matchClosing: true
            }
        ]
    }
}

export function newXenvServerLog() {
    return {
        view:"list",
        id:'log',
        type:{
            height: "auto",
            template(obj){
                return `<div>
                            <p>${obj.data}</p>
                            <div><span class="webix_icon fa-clock-o"></span>${obj.timestamp} [${new Date(obj.timestamp)}]</div>
                        </div>`;
            }
        }
    }
}

export function newXenvHqToolbar() {
    return {
        view: "toolbar",
        maxHeight: 30,
        cols: [
            {},
            {
                view: "icon",
                icon: "mdi mdi-settings",
                maxWidth: 30,
                click: function () {
                    const $$HQsettings = this.getTopParentView().$$("settings");
                    if ($$HQsettings.isVisible())
                        $$HQsettings.hide();
                    else
                        $$HQsettings.show();
                }
            }
        ]
    }
}

export function newXenvHqSettings(config) {
    return {
        id: 'settings',
        hidden: true,
        isolate: true,
        drag: "target",
        rows: [
            {
                id: "main",
                view: "text",
                value: "",
                required: true,
                label: "HQ main",
                labelWidth: 240,
                tooltip: "HQ main",
                labelAlign: "right"
            },
            {
                id: "configuration",
                view: "text",
                value: "",
                required: true,
                label: "HQ configuration manager",
                labelWidth: 240,
                tooltip: "HQ configuration manager",
                labelAlign: "right"
            },
            {
                id: "manager",
                view: "text",
                value: "",
                required: true,
                label: "HQ xenv servers manager",
                labelWidth: 240,
                tooltip: "HQ xenv servers manager",
                labelAlign: "right"
            },
            {
                id: "camel",
                view: "text",
                value: "",
                label: "CamelIntegration",
                labelWidth: 240,
                tooltip: "CamelIntegration",
                labelAlign: "right"
            },
            {
                id: "status_server",
                view: "text",
                value: "",
                label: "StatusServer",
                labelWidth: 240,
                tooltip: "StatusServer",
                labelAlign: "right"
            },
            {
                id: "data_format_server",
                view: "text",
                value: "",
                label: "DataFormatServer",
                labelWidth: 240,
                tooltip: "DataFormatServer",
                labelAlign: "right"
            },
            {
                id: "predator",
                view: "text",
                value: "",
                label: "PreExperimentDataCollector",
                labelWidth: 240,
                tooltip: "PreExperimentDataCollector",
                labelAlign: "right"
            },
            {},
            {
                cols: [
                    {},
                    {
                        view: "button",
                        value: "Apply",
                        maxWidth: 120,
                        click() {
                            config.root.run();
                        }
                    }
                ]
            }
        ]
    }
}

export function newXenvHqBody(config){
    return {
        view: "tabview",
        cells: [
            {
                header: "Main",
                body: newXenvMainBody(config)
            },
            {
                header: "DataSources",
                body: newDataSourcesBody(config)
            },
            {
                header: "DataFormatServer",
                body: newDfsViewBody(config)
            },
            {
                header: "StatusServer",
                body: newStatusServerViewBody(config)
            },
            {
                header: "CamelIntegration",
                body: newCamelIntegrationViewBody(config)
            },
            {
                header: "PreExperimentDataCollector",
                body: newPredatorViewBody(config)
            }
        ]
    };
}

export function newXenvHqBottom(config) {
    return {
        view: "button",
        value: "Update & Restart all",
        minHeight: 80,
        click() {
            config.root.updateAndRestartAll()
        }
    }
}

const kXenvHqPanelHeader = '<span class="webix_icon mdi mdi-cube-scan"></span>XenvHQ DataSources Collections';

function newDataSourceCollectionForm(config) {
    return {
        view: "form",
        id: "frmCollectionSettings",
        hidden: true,
        elements: [
            {
                view: "text",
                name: "id",
                label: "Name",
                labelAlign: "right",
                validate: webix.rules.isNotEmpty
            },
            {
                view: "text",
                id: "txtCollectionProto",
                name: "value",
                label: "Copy from",
                labelAlign: "right"
            },
            {
                cols: [
                    {},
                    {
                        view: "icon",
                        id: 'btnAddProfile',
                        icon: "mdi mdi-content-save",
                        maxWidth: 30,
                        click() {
                            const $$frm = this.getFormView();
                            if (!$$frm.validate()) return;

                            const values = $$frm.getValues();

                            const id = config.root.addCollection(values);

                            this.getTopParentView().$$('list').select(id);
                        }
                    }
                ]
            }
        ]
    };
}

export function newXenvHqLeftPanel(config) {
    return {
        view: 'accordionitem',
        id: kXenvLeftPanel,
        header: kXenvHqPanelHeader,
        headerAlt: kXenvHqPanelHeader,
        headerHeight: 32,
        headerAltHeight: 32,
        collapsed: true,
        body: {
            id: kXenvHqPanelId,
            isolate: true,
            rows: [
                {
                    id: 'list',
                    view: "list",
                    select: true,
                    template: "#id#",
                    on: {
                        onItemClick(id) {
                            if (this.getSelectedId() === id) {
                                this.unselectAll()
                                this.select(id);
                            }
                        },
                        onAfterSelect(id) {
                            config.root.selectCollection(id);
                        },
                        onAfterLoad() {
                            if (this.count() > 0)
                                this.select(this.getFirstId());
                        }
                    }
                },
                newDataSourceCollectionForm(config),
                {
                    borderless: true,
                    view: "toolbar",
                    cols: [
                        {
                            view: "icon",
                            icon: "wxi-trash",
                            maxWidth: 30,
                            tooltip: "Delete selected profile",
                            click() {
                                // parent.deleteCollection(values.id).then(() => {
                                //     parent.collections.remove(values.id);
                                //     parent.datasources.clearAll();
                                //     parent.$$('selectDataSources').setValue("");
                                // });
                                config.root.deleteCollection(config.root.$$panel.$$('list').getSelectedId());
                            }
                        },
                        {},
                        {
                            view: "icon",
                            icon: "mdi mdi-settings",
                            tooltip: "Toggle settings",
                            maxWidth: 30,
                            click() {
                                const $$settings = config.root.$$settings;
                                if ($$settings.isVisible())
                                    config.root.$$body.show();
                                else
                                    $$settings.show();
                            }
                        },
                        {
                            view: "icon",
                            icon: "wxi-plus",
                            tooltip: "Show new profile form",
                            maxWidth: 30,
                            click() {
                                const $$frmCollection = this.getTopParentView().$$('frmCollectionSettings');
                                if ($$frmCollection.isVisible())
                                    $$frmCollection.hide();
                                else
                                    $$frmCollection.show();
                            }
                        }
                    ]
                }
            ]

        }
    }
}