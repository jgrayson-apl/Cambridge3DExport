/*
 Copyright 2022 Esri

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * https://www.cambridgema.gov/GIS/3D/3ddata/3ddatadownloadmap
 */

import AppBase from "./support/AppBase.js";
import AppLoader from "./loaders/AppLoader.js";
import ViewLoading from './apl/ViewLoading.js';
import DownloadLinksPanel from './DownloadLinksPanel.js';

class Application extends AppBase {

  // PORTAL //
  portal;

  constructor() {
    super();

    // LOAD APPLICATION BASE //
    super.load().then(() => {

      // APPLICATION LOADER //
      const applicationLoader = new AppLoader({app: this});
      applicationLoader.load().then(({portal, group, map, view}) => {
        //console.info(portal, group, map, view);

        // PORTAL //
        this.portal = portal;

        // SET APPLICATION DETAILS //
        this.setApplicationDetails({map, group});

        // APPLICATION //
        this.applicationReady({portal, group, map, view}).catch(this.displayError).then(() => {
          // HIDE APP LOADER //
          document.getElementById('app-loader').toggleAttribute('hidden', true);
        });

      }).catch(this.displayError);
    }).catch(this.displayError);

  }

  /**
   *
   * @param view
   */
  configView({view}) {
    return new Promise((resolve, reject) => {
      if (view) {
        require([
          'esri/core/reactiveUtils',
          'esri/widgets/Popup',
          'esri/widgets/Home',
          'esri/widgets/Search'
        ], (reactiveUtils, Popup, Home, Search) => {

          // VIEW AND POPUP //
          view.set({
            constraints: {snapToZoom: false},
            popup: new Popup({
              dockEnabled: true,
              dockOptions: {
                buttonEnabled: false,
                breakpoint: false,
                position: "top-right"
              }
            })
          });

          // SEARCH //
          const search = new Search({view});
          view.ui.add(search, {position: 'top-left', index: 0});

          // HOME //
          const home = new Home({view});
          view.ui.add(home, {position: 'top-left', index: 1});

          // VIEW LOADING INDICATOR //
          const viewLoading = new ViewLoading({view: view});
          view.ui.add(viewLoading, 'bottom-right');

          resolve();
        });
      } else { resolve(); }
    });
  }

  /**
   *
   * @param portal
   * @param group
   * @param map
   * @param view
   * @returns {Promise}
   */
  applicationReady({portal, group, map, view}) {
    return new Promise(async (resolve, reject) => {
      // VIEW READY //
      this.configView({view}).then(() => {

        // HIDE HEADER IF EMEDDED //
        if (this.embedded != null) {
          document.querySelector('header').style.setProperty('display', 'none');
        }

        // SKETCH TOOLS //
        this.initializeSketchTools({view});
        // FORMATS LIST //
        this.initializeFormatsList({view});
        // DOWNLOAD LINKS //
        this.initializeDownloadLinks({view});

        resolve();
      }).catch(reject);
    });
  }

  /**
   *
   * @param view
   */
  initializeFormatsList({view}) {

    const formatsList = document.getElementById('formats-list');

    const _formatsSelected = () => {
      const selectedFormats = Array.from(formatsList.selectedItems).map(selectedItem => selectedItem.value);
      this.dispatchEvent(new CustomEvent('formats-change', {detail: {selectedFormats}}));
    };

    formatsList.addEventListener('calciteListItemSelect', () => {
      _formatsSelected();
    });

    const _updateFormatsSelection = ({selectAll = true}) => {
      formatsList.querySelectorAll('calcite-list-item').forEach(listItem => {
        listItem.toggleAttribute('selected', selectAll);
      });
      !selectAll && (formatsList.selectedItems = []);
      _formatsSelected();
    };

    const formatsSelectAllAction = document.getElementById('formats-select-all-action');
    formatsSelectAllAction.addEventListener('click', () => {
      _updateFormatsSelection({selectAll: true});
    });
    const formatsSelectNoneAction = document.getElementById('formats-select-none-action');
    formatsSelectNoneAction.addEventListener('click', () => {
      _updateFormatsSelection({selectAll: false});
    });

  }

  /**
   *
   * @param view
   */
  initializeSketchTools({view}) {
    require([
      'esri/core/promiseUtils',
      'esri/core/reactiveUtils',
      'esri/layers/GraphicsLayer',
      'esri/widgets/Sketch'
    ], (promiseUtils, reactiveUtils, GraphicsLayer, Sketch) => {

      // SELECTED INDEX GRIDS LABEL //
      const selectedIndexGridLabel = document.getElementById('selected-index-grid-label');

      // INDEX GRIDS LAYER //
      const indexLayer = view.map.layers.find(l => l.title === 'Cambridge 3D Data Download Grid');
      indexLayer.load().then(() => {
        indexLayer.set({
          outFields: ['*'],
          popupEnabled: false
        });

        // LAYERVIEW //
        view.whenLayerView(indexLayer).then(indexLayerView => {

          // HIGHLIGHT OPTIONS //
          indexLayerView.highlightOptions = {
            color: '#00ffff',
            haloOpacity: 0.9,
            fillOpacity: 0.1
          };

          // QUERY //
          const indexGridQuery = indexLayerView.createQuery();
          indexGridQuery.set({where: '(1=1)'});

          // HIGHLIGHT //
          let indexHighlight;

          /**
           *
           * @param {string} state
           * @param {Graphic} graphic
           * @private
           */
          const _updateIndexGridList = ({state, graphic}) => {
            if (graphic) {
              // SET QUERY GEOMETRY //
              indexGridQuery.set({geometry: graphic.geometry});

              // GET INDEX GRIDS FEATURES //
              indexLayerView.queryFeatures(indexGridQuery).then((indexFS) => {
                if (indexFS.features.length) {

                  // UPDATE HIGHLIGHT //
                  indexHighlight && indexHighlight.remove();
                  indexHighlight = indexLayerView.highlight(indexFS.features);

                  // BUILD LIST OF INDEX GRID IDS //
                  const indexIDs = indexFS.features.map(feature => {
                    const {grid_col, grid_row} = feature.attributes;
                    return `${ grid_col }${ grid_row }`;
                  });
                  // DISPLAY SELECTED INDEX GRIDS LABEL //
                  selectedIndexGridLabel.innerHTML = indexIDs.join(' | ');

                  if (state === 'complete') {
                    // DISPATCH EVENT IF SELECTION IS COMPLETE //
                    this.dispatchEvent(new CustomEvent('index-grid-change', {detail: {indexIDs}}));
                  }
                } else {
                  // CLEAR SELECTION IF NO INTERSECTING INDEX GRID FEATURES //
                  indexHighlight && indexHighlight.remove();
                  selectedIndexGridLabel.innerHTML = '';
                  this.dispatchEvent(new CustomEvent('index-grid-change', {detail: {indexIDs: []}}));
                }
              });
            } else {
              // CLEAR SELECTION IF NO SEARCH GEOMETRY //
              indexHighlight && indexHighlight.remove();
              selectedIndexGridLabel.innerHTML = '';
              this.dispatchEvent(new CustomEvent('index-grid-change', {detail: {indexIDs: []}}));
            }
          };

          // SKETCH LAYER //
          const sketchLayer = new GraphicsLayer({title: 'Sketch', listMode: 'hide'});
          view.map.add(sketchLayer);

          // SKETCH //
          const sketch = new Sketch({
            container: 'sketch-container',
            view,
            layer: sketchLayer,
            creationMode: 'single',
            //availableCreateTools: ["point", "polygon", "rectangle", "circle"],
            defaultUpdateOptions: {tool: 'transform'},
            snappingOptions: {
              enabled: true,
              selfEnabled: true,
              featureEnabled: true
            },
            visibleElements: {
              selectionTools: {"lasso-selection": false, "rectangle-selection": false},
              undoRedoMenu: false,
              settingsMenu: false
            }
          });
          sketch.viewModel.set({
            polygonSymbol: {
              type: 'simple-fill',
              color: '#1C6F09',
              style: 'diagonal-cross',
              outline: {
                style: 'solid',
                color: '#1C6F09',
                width: 2.2
              }
            }
          });

          // COLLAPSE TOP LEVEL DROPDOWN WHILE SELECTING/SKETCHING //
          const exportPanel = document.getElementById('export-panel');
          reactiveUtils.watch(() => sketch.activeTool, (activeTool) => {
            exportPanel.open = (activeTool == null);
          });

          // UPDATE INDEX GRID LIST WHILE SELECTING/SKETCHING //
          reactiveUtils.on(() => sketch, 'create', ({graphic, state}) => {
            if (graphic) {
              switch (state) {
                case 'start':
                  _updateIndexGridList({state});
                  break;
                case 'active':
                case 'complete':
                  sketchLayer.removeAll();
                  _updateIndexGridList({state, graphic});
                  break;
              }
            }
          });

          // CLEAR INDEX GRID LIST //
          const gridsClearAction = document.getElementById('grids-clear-action');
          gridsClearAction.addEventListener('click', () => {
            _updateIndexGridList({});
          });

        });
      });
    });
  }

  /**
   *
   * @param view
   */
  initializeDownloadLinks({view}) {

    // INDEX GRID FLOW //
    const indexGridFlow = document.getElementById('index-grid-flow');
    // INDEX GRID LIST //
    const indexGridList = document.getElementById('index-grid-list');
    // GRID ITEM TEMPLATE //
    const gridItemTemplate = document.getElementById('grid-item-template');

    let _downloadLinksPanels = [];
    let _selectedFormats = [];

    // RESET INDEX GRID FLOW //
    const _resetIndexGridFlow = () => {
      // GO BACK IF CURRENTLY VIEWING A GRID FLOW ITEM //
      if (indexGridFlow.querySelectorAll('calcite-flow-item').length > 1) {
        indexGridFlow.back();
      }
    };

    //
    // FORMATS CHANGE //
    //
    this.addEventListener('formats-change', ({detail: {selectedFormats}}) => {

      // SELECTED FORMATS //
      _selectedFormats = selectedFormats;

      // UPDATE DOWNLOAD LINKS PANELS //
      _downloadLinksPanels.forEach(downloadLinksPanel => {
        downloadLinksPanel.selectedFormats = _selectedFormats;
      });

      // NO SELECTED FORMATS //
      const noSelectedFormats = !_selectedFormats.length;

      // TOGGLE INDEX GRID LIST //
      indexGridList.toggleAttribute('disabled', noSelectedFormats);

      // GO BACK IF NOT SELECTION AND CURRENTLY VIEWING A GRID FLOW ITEM //
      noSelectedFormats && _resetIndexGridFlow();

    });

    //
    // DOWNLOAD ALL //
    //
    const downloadAllBtn = document.getElementById('download-all-btn');
    downloadAllBtn.addEventListener('click', () => {
      _downloadLinksPanels.forEach(downloadLinksPanel => {
        downloadLinksPanel.downloadAll();
      });
    });

    //
    // INDEX GRIDS CHANGE //
    //
    this.addEventListener('index-grid-change', ({detail: {indexIDs}}) => {

      // GO BACK IF CURRENTLY VIEWING A GRID FLOW ITEM //
      _resetIndexGridFlow();

      // CREATE DOWNLOAD LINKS PANEL, FLOW ITEM, AND LIST ITEM //
      const {downloadLinksPanels, listItems} = indexIDs.reduce((infos, indexID) => {

        // LINKS PANEL //
        const linksPanel = new DownloadLinksPanel({gridIndexID: indexID, selectedFormats: _selectedFormats});
        infos.downloadLinksPanels.push(linksPanel);

        // FLOW ITEM //
        const flowItem = document.createElement("calcite-flow-item");
        flowItem.setAttribute('heading', `Grid ${ indexID }`);
        flowItem.append(linksPanel);

        // TEMPORARILY ADD FLOW ITEM SO DOWNLOADLINKPANEL IS CREATED //
        indexGridFlow.append(flowItem);

        // LIST ITEM //
        const templateContent = gridItemTemplate.content.cloneNode(true);
        const listItem = templateContent.querySelector('calcite-list-item');
        listItem.setAttribute('value', indexID);
        listItem.setAttribute('label', `Grid ${ indexID }`);
        listItem.addEventListener("calciteListItemSelect", () => {
          indexGridFlow.append(flowItem);
        });
        infos.listItems.push(listItem);

        // DOWNLOAD BUTTON //
        const downloadBtn = listItem.querySelector('calcite-button');
        downloadBtn.innerHTML = `All files for Grid ${ indexID }`;
        downloadBtn.addEventListener('click', () => {
          linksPanel.downloadAll();
        });

        // REMOVE FLOW ITEM //
        flowItem.remove();

        return infos;
      }, {downloadLinksPanels: [], listItems: []});

      // UPDATE GRID LIST ITEMS //
      indexGridList.replaceChildren(...listItems);

      // SET CURRENT LIST OF DOWNLOAD LINK PANELS //
      _downloadLinksPanels = downloadLinksPanels;

      // TOGGLE DOWNLOAD ALL BUTTON //
      downloadAllBtn.toggleAttribute('disabled', !_downloadLinksPanels.length);
    });

  }

}

export default new Application();
