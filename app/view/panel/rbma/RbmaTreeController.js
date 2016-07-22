Ext.define('MoMo.client.view.panel.rbma.RbmaTreeController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.panel.rbma.rbmatree',

    /**
     * Set store for the RBMA document tree
     */
    setRbmaStoreAndRootNode: function() {
        var me = this,
            treeView = me.getView(),
            rbmaStore;

        rbmaStore = Ext.create('MoMo.client.store.Rbma', {
            autoLoad: false
        });

        treeView.store = rbmaStore;

        // get the root node manually and set it
        // (as we did not yet mananged to
        // load the root node from the backend via rest-proxy)
        // TODO: make it better (so that store.load() would always work)
        Ext.Ajax.request({
            url: rbmaStore.getModel().getProxy().getUrl() + '/root',
            success: function(response) {
                var rootNode = Ext.decode(response.responseText);
                treeView.setRootNode(rootNode);
            }
        });

    },

    /**
     * Shows a context menu on mouse right click in RBMA document tree
     * @param {Ext.view.View} View Document tree view
     * @param {Ext.data.Model} rec The record that belongs to the item
     * @param {HTMLElement} item
     * @param {Number} index The item's index
     * @param {Ext.event.Event} The raw event object
     */
    onItemContextMenuClick: function(view, rec, item, index, e){

        var me = this;

        // forbid the standard browser context menu
        e.preventDefault();

        // folder was clicked
        if (rec && rec.get('leaf') === false) {
            rec.contextmenu = me.createFolderContextMenu(rec);
        // leaf was clicked
        } else {
            if (!rec.contextmenu) {
                rec.contextmenu = me.createLeafContextMenu(rec);
            }
        }
        rec.contextmenu.showAt(e.pageX, e.pageY);
    },

    /**
     * Creates a folder context menu for the current record
     * @param {Ext.data.Model} record Clicked record
     * @return folderContextMenu
     */
    createFolderContextMenu: function(record){
        var me = this,
            vm = me.getViewModel(),
            folderContextMenu;

        if (!record || (record && record.get('leaf'))) {
            return false;
        }

        var addFolder = Ext.create('Ext.menu.Item', {
            text: vm.get('addNewFolderText'),
            handler: function(){
                Ext.Msg.prompt(
                    vm.get('folderNameText'),
                    vm.get('folderNamePromptText'),
                    function(btn, text, cfg){
                        if(btn === 'ok'){
                            if (Ext.isEmpty(text)) {
                                Ext.Msg.show(Ext.apply({}, cfg));
                            }
                            var cls =
                                'de.terrestris.momo.model.tree.RbmaTreeFolder';
                            record.appendChild({
                                '@class': cls,
                                text: text,
                                leaf: false
                            });
                            me.getView().getStore().sync();
                        }
                    }
                );
            }
        });

        var addLeaf = Ext.create('Ext.menu.Item', {
            text: vm.get('addNewLeafText'),
            handler: function(){
                Ext.Msg.prompt(
                        vm.get('leafNameText'),
                        vm.get('leafNamePromptText'),
                    function(btn, text, cfg){
                        if(btn === 'ok') {
                            if (Ext.isEmpty(text)) {
                                Ext.Msg.show(Ext.apply({}, cfg));
                            }
                            var cls =
                                'de.terrestris.momo.model.tree.RbmaTreeLeaf';
                            record.appendChild({
                                '@class': cls,
                                text: text,
                                leaf: true
                            });
                            me.getView().getStore().sync();
                        }
                    }
                );
            }
        });

        var addOrReplaceDocument = Ext.create('Ext.menu.Item', {
            text: vm.get('addDocumentText'),
            handler: function(rec) {
                var uploadForm =
                    Ext.create('MoMo.client.view.window.rbma.RbmaPdfUpload', {
                        rec: rec
                    }
                );
                uploadForm.show();
            }
        });

        var renameFolder = Ext.create('Ext.menu.Item', {
            text: vm.get('renameFolderText'),
            handler: function(){
                Ext.Msg.prompt(
                    vm.get('folderNameText'),
                    vm.get('folderNewNamePromptText'),
                    function(btn, text, cfg){
                        if(btn === 'ok'){
                            if (Ext.isEmpty(text)) {
                                Ext.Msg.show(Ext.apply({}, cfg));
                            }
                            record.set('text', text);
                            me.getView().getStore().sync();
                        }
                    }
                );
            }
        });

        var deleteFolder = Ext.create('Ext.menu.Item', {
            text: vm.get('deleteFolderText'),
            handler: function(){
                Ext.Msg.show({
                    title: vm.get('warningTitle'),
                    message: vm.get('deleteFolderWarnMsgText'),
                    buttons: Ext.Msg.OKCANCEL,
                    ich: Ext.Msg.WARNING,
                    fn: function(btn){
                        if(btn === 'ok') {
                            record.erase();
                        }
                    }
                });
            }
        });

        folderContextMenu = Ext.create('Ext.menu.Menu', {
            plain: true,
            type: 'folder-context-menu',
            items: [
                addFolder,
                addLeaf,
                addOrReplaceDocument,
                renameFolder,
                deleteFolder
            ]
        });

        return folderContextMenu;
    },

    /**
     * Creates a leaf context menu for the current record
     * @param {Ext.data.Model} record Clicked record
     * @return leafContextMenu
     */
    createLeafContextMenu: function(record) {
        var me = this,
            vm = me.getViewModel(),
            leafContextMenu;

        if (!record || (record && !record.get('leaf'))) {
            return false;
        }

        var renameLeaf = Ext.create('Ext.menu.Item', {
            text: vm.get('renameLeafText'),
            handler: function(){
                Ext.Msg.prompt(
                    vm.get('leafNameText'),
                    vm.get('leafNewNamePromptText'),
                    function(btn, text, cfg){
                        if(btn === 'ok') {
                            if (Ext.isEmpty(text)) {
                                Ext.Msg.show(Ext.apply({}, cfg));
                            }
                            record.set('text', text);
                            me.getView().getStore().sync();
                        }
                    }
                );
            }
        });

        var deleteLeaf = Ext.create('Ext.menu.Item', {
            text: vm.get('deleteLeafText'),
            handler: function(){
                Ext.Msg.show({
                    title: vm.get('warningTitle'),
                    message: vm.get('deleteLeafWarnMsgText'),
                    buttons: Ext.Msg.OKCANCEL,
                    ich: Ext.Msg.WARNING,
                    fn: function(btn){
                        if(btn === 'ok') {
                            record.erase();
                        }
                    }
                });
            }
        });

        leafContextMenu = Ext.create('Ext.menu.Menu', {
            plain: true,
            type: 'leaf-context-menu',
            items: [
                renameLeaf,
                deleteLeaf
            ]
        });

        return leafContextMenu;
    },

    /**
     * Synchronize the tree store after each drop event
     */
    onDragDrop: function () {
        var me = this;
        me.getView().getStore().sync();
    }
});
