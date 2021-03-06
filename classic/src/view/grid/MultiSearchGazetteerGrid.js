/* Copyright (c) 2016 terrestris GmbH & Co. KG
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 *
 * A grid showing results of the multisearch gazetteer response values.
 * Extends the `BasiGX.view.grid.MultiSearchGazetteerGrid` class.
 *
 * @class MoMo.client.view.grid.MultiSearchGazetteerGrid
 */
Ext.define("MoMo.client.view.grid.MultiSearchGazetteerGrid",{
    extend: "BasiGX.view.grid.MultiSearchGazetteerGrid",
    xtype: "momo-grid-multisearchgazetteergrid",

    viewModel: {
        data: {
            /*i18n*/
            title: ''
            /*i18n*/
        }
    }

});
