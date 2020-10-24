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

const urlBase = 'http://spatial-rest-services-spatial.openshift-gis-apps.gce-containers.crunchydata.com/';
const urlPg_Fs = 'http://pgfeatureserv-scfire.openshift-gis-apps.gce-containers.crunchydata.com';

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
     * @param {number | string} pid

     * @param {number | string} distance
     * @returns {Promise<Array<SurroundingParcel>>}
     */
<<<<<<< HEAD
    async getSurroundingParcels(pid, distance) {
      const url = `${urlPg_Fs}/functions/parcels_dist/items?in_gid=${pid}&dist=${distance}&limit=1000`
            const response = await fetch(url);
=======
    async getSurroundingParcels(gid, distance) {
      const url = `${urlPg_Fs}/functions/parcel_withindist/items?pid=${gid}&dist=${distance}&limit=1000`
      //const url = `${urlBase}/notify/parcel-and-distance?parcelid=${parcelId}&dist=${distance}`;
      const response = await fetch(url);
>>>>>>> 7afdc5815e4b19ebc5ee983b5fad338732b655b9
      const json = await response.json();
      return json;
    },
    /**
     * Sends an API request to get the firehazard status
     * @param {number | string} pid
     * @returns {Promise<boolean>}
     */
    async getFireHazardStatus(pid) {
      const url = `${urlPg_Fs}/collections/groot.assessor_parcels/items/${pid}?properties=fireHazard`;
      const response = await fetch(url);
      const json = await response.json();
      const isFireHazard = json.properties.firehazard === 'Yes';
      return isFireHazard;
    },
    /**
     * Sends an API request to set the firehazard status
     * @param {number | string} pid

     * @param {boolean} isFireHazard
     */
  async setFireHazardStatus(pid, isFireHazard) {
      let firehaz = isFireHazard ? 'Y' : 'N';
      const url = `${urlPg_Fs}/functions/parcel_set_firehazard/items?pid=${pid}&is_hazard=${firehaz}`;
      await fetch(url);
    },
  },
};

export default api;
