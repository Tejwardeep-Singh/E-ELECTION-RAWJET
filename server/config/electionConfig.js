const electionConfig = {
  "Lok Sabha": {
    state: false,
    district: false,
    city: false,
  },
  "Assembly": {
    state: true,
    district: false,
    city: false,
  },
  "District": {
    state: true,
    district: true,
    city: false,
  },
  "Municipal": {
    state: true,
    district: false,
    city: true,
  },
  "Panchayat": {
    state: true,
    district: true,
    city: true,
  },
};

module.exports = electionConfig;