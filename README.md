# Cambridge 3D Export

This interactive map is designed to allow you to find and download 3D data for the City of Cambridge. 
The City has been divided into a grid system allowing for users to download 3D data for a specific area. 
You can search for a specific address or simply zoom to your area of interest. 
Click on the grid block and choose the file type(s) you would like to download.

This app is designed to be used as a standalone site, or embedded in a similar fashion as this site:
- [3D Data Download Map](https://www.cambridgema.gov/GIS/3D/3ddata/3ddatadownloadmap)
  - Please see Embed section below for deployment details.

### Technologies Used

- [ArcGIS API for Javascript](https://developers.arcgis.com/javascript/latest/api-reference/)
- [Calcite Components](https://developers.arcgis.com/calcite-design-system/components/)


### Deploy

This application is built as a _static_ web application.

1. Download and copy the root folder to a web accessible location
2. Update configuration parameters in application.json

### Configure

Update the parameters in ./config/application.json file in your favorite json editor:

|      parameter | details                                                           |
|---------------:|-------------------------------------------------------------------|
|  **portalUrl** | Organization or Enterprise URL; example: https://www.arcgis.com   |
| **oauthappid** | The OAuth ID of the Web Application item                          |
|   **authMode** | For public access set to 'anonymous' (and set oauthappid to null) |
|     **apiKey** | ArcGIS Platform API key                                           |
|     **webmap** | The item id of the web map                                        |
|   **webscene** | The item id of the web scene                                      |
|  **viewProps** | Additional view properties.                                       | 
|  **shareable** | List of shareable properties                                      |


#### Embed
This application supports a URL parameter called ***embedded*** that will:

* hide the top header
* not show the startup dialog

Usage: ...\Cambridge3DExport\index.html?***embedded=true***


#### For questions about the demo web application:

> John Grayson | Prototype Specialist | Geo Experience Center\
> Esri | 380 New York St | Redlands, CA 92373 | USA\
> T 909 793 2853 x1609 | [jgrayson@esri.com](mailto:jgrayson@esri.com) | [GeoXC Demos](https://geoxc.esri.com) | [esri.com](https://www.esri.com)
