/**
 * Parcel object props
 * @typedef {Object} Parcel
 * @property {string} id
 * @property {string} apn
 * @property {string} address
 * @property {boolean} isFireHazard
 */

/**
  * getSurroundingParcels function props
  * @typedef {Object} SurroundingParcel
  * @property {string} acres
  * @property {string} address
  * @property {string} geom
  * @property {string} parcelid
  */

/**
 * @typedef {Object} ParcelCoords
 * @property {number} lat
 * @property {number} lon
 * @property {number} parcelid
 */

const urlBase = 'http://spatial-rest-services-spatial.openshift-gis-apps.gce-containers.crunchydata.com';
const urlPg_Fs = 'http://pgfeatureserv-spatial.openshift-gis-apps.gce-containers.crunchydata.com';

/** Parcel search functions */
const api = {
  parcels: {
    /**
     * Simulates an API request to search parcels by address
     * @param {string} address
     * @returns {Promise<ParcelCoords>}
     */
    async getParcelCoords(address) {
      const
        addressEncoded = encodeURI(address),
        url = `${urlBase}/geocode/${addressEncoded}`;

      const response = await fetch(url);
      const json = await response.json();
      return json;
    },
    /**
     * Sends an API request to search parcels by distance
     * @param {number | string} parcelId
     * @param {number | string} gid
     * @param {number | string} distance
     * @returns {Promise<Array<SurroundingParcel>>}
     */
    async getSurroundingParcels(parcelId, distance) {
      const url = `${urlBase}/notify/parcel-and-distance?parcelid=${parcelId}&dist=${distance}`;
      const response = await fetch(url);
      const json = await response.json();
      return json;
    },
    /**
     * Sends an API request to get the firehazard status
     * @param {number | string} parcelId
     * @param {number | string} gid
     * @returns {Promise<boolean>}
     */
    async getFireHazardStatus(gid) {
      const url = `${urlPg_Fs}/collections/groot.assessor_parcels/items/30634?properties=${gid},fireHazard`;
      const response = await fetch(url);
      const json = await response.json();
      const isFireHazard = json.firehazard === 'Yes';
      return isFireHazard;
    },
    /**
     * Sends an API request to set the firehazard status
     * @param {number | string} parcelId
     * @param {boolean} isFireHazard
     */
    async setFireHazardStatus(parcelId, isFireHazard) {
      const url = `${urlBase}/parcel/firehazard/${parcelId}`;
      const body = { firehazard: isFireHazard ? 'Yes' : 'No' };
      await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
  },
};

export default api;
