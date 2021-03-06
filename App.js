Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:'<a href="https://help.rallydev.com/apps/2.0rc3/doc/">App SDK 2.0rc3 Docs</a>'},
        launch: function() {
            var myFilter = '';
            
            // if there is a timebox on the dashboard/page, make use of it
            var timeboxScope = this.getContext().getTimeboxScope();
            if( timeboxScope ) {
                myFilter = (timeboxScope.getQueryFilter());
            } 
            
            Rally.data.ModelFactory.getModel({
                type: 'UserStory',
                success: function(model) {
                    this.grid = this.add({
                        xtype: 'rallygrid',
                        model: model,
                        columnCfgs: [
                            {
                                text: "Story ID",
                                dataIndex: "FormattedID",
                                flex: 1,
                                xtype: "templatecolumn",
                                tpl: Ext.create("Rally.ui.renderer.template.FormattedIDTemplate")
                            }, 
                            {
                                text: "Name",
                                dataIndex: "Name",
                                flex: 2
                            }, 
                            {
                                text: "Iteration",
                                dataIndex: "Iteration",
                                renderer: this._renderName
                            },
                            {
                                text: "Owner",
                                dataIndex: "Owner"
                            },
                            {
                               text: "Test Case Count",
                                dataIndex: "TestCases",
                                editor: null,
                                renderer: this._renderTestCaseCount
                            }
                        ],
                        storeConfig: {
                            filters: [myFilter]
                        }
                    });
                },
                scope: this
            });
        },

        _createGrid: function(myStore) {
        this._myGrid = Ext.create("Rally.ui.grid.Grid", {
            xtype: "rallygrid",
            title: "Stories With Test Case Counts",
            height: "98%",
            store: myStore,
            columnCfgs: [
                {
                    text: "Story ID",
                    dataIndex: "FormattedID",
                    flex: 1,
                    xtype: "templatecolumn",
                    tpl: Ext.create("Rally.ui.renderer.template.FormattedIDTemplate")
                }, 
                {
                    text: "Name",
                    dataIndex: "Name",
                    flex: 2
                }, 
                {
                    text: "Iteration",
                    dataIndex: "Iteration",
                    renderer: this._renderName
                },
                {
                    text: "Owner",
                    dataIndex: "Owner"
                },
                {
                   text: "Test Case Count",
                    dataIndex: "TestCases",
                    editor: null,
                    renderer: this._renderTestCaseCount
                }
            ]
        }), this.add(this._myGrid);
    },
    
    _updateGrid: function(myStore) {
        this._myGrid.reconfigure(myStore);
    },
    
    onTimeboxScopeChange: function(newTimeboxScope) {
        // console.log("Timebox Changed called");
        var newFilter = (newTimeboxScope.getQueryFilter());
        var store = this.grid.getStore();
        store.clearFilter(true);
        store.filter(newFilter);
        this._updateGrid(store);
    },
    _renderTestCaseCount : function(value,meta,rec,row,col) {
        //console.log("test case value: ", value);
        return value ? value.Count : value;
    },
    
    _renderName : function(value,meta,rec,row,col) {
        //console.log("value: ", value);
        return value ? value.Name : value;
    }
    
});
