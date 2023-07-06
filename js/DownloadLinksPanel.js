/*
 Copyright 2023 Esri

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
 *
 * DownloadLinksPanel
 *  - Element: apl-download-links-panel
 *  - Description: Download Links Panel
 *
 * Author:   John Grayson - Applications Prototype Lab - Esri
 * Created:  5/18/2023 - 0.0.1 -
 * Modified:
 *
 */

class DownloadLinksPanel extends HTMLElement {

  static version = '0.0.1';

  /**
   * @type {HTMLElement}
   */
  container;

  /**
   * @type {string}
   */
  #gridIndexID;

  /**
   * @type {string[]}
   */
  #selectedFormats;
  set selectedFormats(value) {
    this.#selectedFormats = value;
    this.updateLinks();
  }

  /**
   * @type {boolean}
   */
  #loaded = false;
  get loaded() {
    return this.#loaded;
  }

  set loaded(value) {
    this.#loaded = value;
    this.dispatchEvent(new CustomEvent('loaded', {detail: {}}));
  }

  /**
   *
   * @param {HTMLElement|string} [container]
   * @param {string} gridIndexID
   * @param {string[]} selectedFormats
   */
  constructor({container, gridIndexID, selectedFormats = []}) {
    super();

    this.container = (container instanceof HTMLElement) ? container : document.getElementById(container);

    this.#gridIndexID = gridIndexID;
    this.#selectedFormats = selectedFormats;

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `
      <style>
        :host {
          --calcite-label-margin-bottom: 0;
          max-height: 50vh;
        }      
        :host calcite-card {
          margin: 0.1rem;
        }
        :host calcite-label {
          margin: 0.3rem;
        }
      </style>   
      <calcite-panel>                   
        <calcite-list>
          <calcite-list-item-group heading="Building Models">
        
            <calcite-list-item label="SketchUp SKP" value="SketchUp SKP">
              <calcite-button class="download-btn" slot="actions-end" scale="s" round appearance="outline-fill" kind="neutral" icon-end="download" href="https://cambmagisdata.blob.core.windows.net/camb3d2022/CAMB3D_${ gridIndexID }_SKP_Buildings_skp.zip" target="_blank" rel="noopener noreferrer">download</calcite-button>
              <calcite-button slot="actions-end" appearance="outline-fill" icon-start="information" href="https://www.cambridgema.gov/GIS/3D/3ddata/sketchupskp" target="_blank" rel="noopener noreferrer" hidden></calcite-button>              
            </calcite-list-item>            
            
            <calcite-list-item label="OBJ" value="OBJ">
              <calcite-button class="download-btn" slot="actions-end" scale="s" round appearance="outline-fill" kind="neutral" icon-end="download" href="https://cambmagisdata.blob.core.windows.net/camb3d2022/CAMB3D_${ gridIndexID }_OBJ_Buildings_obj.zip" target="_blank" rel="noopener noreferrer">download</calcite-button>
              <calcite-button slot="actions-end" appearance="outline-fill" icon-start="information" href="https://www.cambridgema.gov/GIS/3D/3ddata/objwavefrontobject" target="_blank" rel="noopener noreferrer" hidden></calcite-button>              
            </calcite-list-item>
            
            <calcite-list-item label="FBX" value="FBX">
              <calcite-button class="download-btn" slot="actions-end" scale="s" round appearance="outline-fill" kind="neutral" icon-end="download" href="https://cambmagisdata.blob.core.windows.net/camb3d2022/CAMB3D_${ gridIndexID }_FBX_Buildings_fbx.zip" target="_blank" rel="noopener noreferrer">download</calcite-button>
              <calcite-button slot="actions-end" appearance="outline-fill" icon-start="information" href="https://www.cambridgema.gov/GIS/3D/3ddata/FBX" target="_blank" rel="noopener noreferrer" hidden></calcite-button>              
            </calcite-list-item>
            
            <calcite-list-item label="GLTF" value="GLTF">
              <calcite-button class="download-btn" slot="actions-end" scale="s" round appearance="outline-fill" kind="neutral" icon-end="download" href="https://cambmagisdata.blob.core.windows.net/camb3d2022/CAMB3D_${ gridIndexID }_GLTF_Buildings.gltf.zip" target="_blank" rel="noopener noreferrer">download</calcite-button>
              <calcite-button slot="actions-end" appearance="outline-fill" icon-start="information" href="https://www.cambridgema.gov/GIS/3D/3ddata/GLTF" target="_blank" rel="noopener noreferrer" hidden></calcite-button>              
            </calcite-list-item>                       
          
          </calcite-list-item-group>        
          <calcite-list-item-group heading="Ground Plans">
        
            <calcite-list-item label="Ground Plan DXF" value="Ground Plan DXF">
              <calcite-button class="download-btn" slot="actions-end" scale="s" round appearance="outline-fill" kind="neutral" icon-end="download" href="https://cambmagisdata.blob.core.windows.net/camb3d2022/CAMB3D_${ gridIndexID }_DXF_Groundplan_dxf.zip" target="_blank" rel="noopener noreferrer">download</calcite-button>
              <calcite-button slot="actions-end" appearance="outline-fill" icon-start="information" href="https://www.cambridgema.gov/GIS/3D/3ddata/groundplandxf" target="_blank" rel="noopener noreferrer" hidden></calcite-button>              
            </calcite-list-item>
            
            <calcite-list-item label="Ground Plan PNG" value="Ground Plan PNG">
              <calcite-button class="download-btn" slot="actions-end" scale="s" round appearance="outline-fill" kind="neutral" icon-end="download" href="https://cambmagisdata.blob.core.windows.net/camb3d2022/CAMB3D_${ gridIndexID }_PNG_GroundPlan.png" target="_blank" rel="noopener noreferrer">download</calcite-button>
              <calcite-button slot="actions-end" appearance="outline-fill" icon-start="information" href="https://www.cambridgema.gov/GIS/3D/3ddata/groundplanpng" target="_blank" rel="noopener noreferrer" hidden></calcite-button>              
            </calcite-list-item>
            
            <calcite-list-item label="2021 Ortho JPG" value="2021 Ortho JPG">
              <calcite-button class="download-btn" slot="actions-end" scale="s" round appearance="outline-fill" kind="neutral" icon-end="download" href="https://cambmagisdata.blob.core.windows.net/camb3d2022/CAMB3D_${ gridIndexID }_JPG_2021Ortho_jpg.zip" target="_blank" rel="noopener noreferrer">download</calcite-button>
              <calcite-button slot="actions-end" appearance="outline-fill" icon-start="information" href="https://www.cambridgema.gov/GIS/3D/3ddata/2021orthojpg" target="_blank" rel="noopener noreferrer" hidden></calcite-button>              
            </calcite-list-item>
            
            <calcite-list-item label="2021 Ortho PNG" value="2021 Ortho PNG">
              <calcite-button class="download-btn" slot="actions-end" scale="s" round appearance="outline-fill" kind="neutral" icon-end="download" href="https://cambmagisdata.blob.core.windows.net/camb3d2022/CAMB3D_${ gridIndexID }_PNG_2021Ortho_png.zip" target="_blank" rel="noopener noreferrer">download</calcite-button>
              <calcite-button slot="actions-end" appearance="outline-fill" icon-start="information" href="https://www.cambridgema.gov/GIS/3D/3ddata/2021orthopng" target="_blank" rel="noopener noreferrer" hidden></calcite-button>              
            </calcite-list-item>
                    
          </calcite-list-item-group>        
          <calcite-list-item-group heading="Terrain">
        
            <calcite-list-item label="2018 Terrain OBJ" value="2018 Terrain OBJ">
              <calcite-button class="download-btn" slot="actions-end" scale="s" round appearance="outline-fill" kind="neutral" icon-end="download" href="https://cambmagisdata.blob.core.windows.net/camb3d2022/CAMB3D_${ gridIndexID }_Terrain_2018_OBJ.zip" target="_blank" rel="noopener noreferrer">download</calcite-button>
              <calcite-button slot="actions-end" appearance="outline-fill" kind="danger" icon-start="exclamation-mark-triangle" href="https://www.cambridgema.gov/Departments/GIS/contact" target="_blank" rel="noopener noreferrer" title="Metadata coming soon!" hidden></calcite-button>
            </calcite-list-item>
        
          </calcite-list-item-group>          
        </calcite-list>
      </calcite-panel>
    `;

    this.container?.append(this);
  }

  /**
   *
   */
  connectedCallback() {

    // INITIAL UPDATE OF LINKS //
    this.updateLinks();

    // LOADED //
    requestAnimationFrame(() => { this.loaded = true; });
  }

  /**
   *
   * @returns {Promise<>}
   */
  load() {
    return new Promise((resolve, reject) => {
      if (this.loaded) { resolve(); } else {
        this.addEventListener('loaded', () => { resolve(); }, {once: true});
      }
    });
  }

  /**
   *
   */
  updateLinks() {

    this.shadowRoot.querySelectorAll('calcite-list-item').forEach(listItem => {
      listItem.toggleAttribute('closed', !this.#selectedFormats.includes(listItem.value));
    });

    requestAnimationFrame(() => {
      this.shadowRoot.querySelectorAll('calcite-list-item-group').forEach(itemGroup => {
        itemGroup.toggleAttribute('hidden', !itemGroup.querySelectorAll('calcite-list-item:not([closed])').length);
      });
    });

  }

  /**
   *
   */
  downloadAll() {
    this.shadowRoot.querySelectorAll('calcite-list-item:not([closed])').forEach(listItem => {
      setTimeout(() => {
        const downloadBtn = listItem.querySelector('calcite-button:first-of-type');
        const downloadLink = downloadBtn?.shadowRoot.querySelector('a');
        downloadLink?.click();
      }, 300);
    });
  }

}

customElements.define("apl-download-links-panel", DownloadLinksPanel);

export default DownloadLinksPanel;
