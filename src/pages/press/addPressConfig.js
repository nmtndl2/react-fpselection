const initialState = {
  pressSize: '',
  maxChamber: '',
  cakeAirT: '',
  cyFwdT: '',
  cyRevT: '',
  dtAvailable: false,
  dtOpenT: '',
  dtClosedT: '',
  psAvailable: false,
  psFwdFPlateT: '',
  psFwdT: '',
  psFwdDT: '',
  psRevT: '',
  psRevDT: '',
  cwAvailable: false,
  cwFwdT: '',
  cwFwdDT: '',
  cwRevT: '',
  cwRevDT: '',
  cwDownT: '',
  cwDownDT: '',
  cwUpT: '',
  cwUpDT: '',
  cwFlowRate: ''
};

const placeholders = {
  maxChamber: 'e.g., 70',
  cakeAirT: 'HH:MM:SS',
  cyFwdT: 'HH:MM:SS',
  cyRevT: 'HH:MM:SS',
  dtOpenT: 'HH:MM:SS',
  dtClosedT: 'HH:MM:SS',
  psFwdFPlateT: 'HH:MM:SS',
  psFwdT: 'HH:MM:SS',
  psFwdDT: 'HH:MM:SS',
  psRevT: 'HH:MM:SS',
  psRevDT: 'HH:MM:SS',
  cwFwdT: 'HH:MM:SS',
  cwFwdDT: 'HH:MM:SS',
  cwRevT: 'HH:MM:SS',
  cwRevDT: 'HH:MM:SS',
  cwDownT: 'HH:MM:SS',
  cwDownDT: 'HH:MM:SS',
  cwUpT: 'HH:MM:SS',
  cwUpDT: 'HH:MM:SS',
  cwFlowRate: 'e.g., 10.0'
};

const labels = {
  pressSize: 'Press Size',
  maxChamber: 'Max Chamber',
  cakeAirT: 'Cake Air Time',
  cyFwdT: 'Cylindrical Forward Time',
  cyRevT: 'Cylindrical Reverse Time',
  dtAvailable: 'DT Available',
  dtOpenT: 'DT Open Time',
  dtClosedT: 'DT Closed Time',
  psAvailable: 'PS Available',
  psFwdFPlateT: 'PS Forward First Plate Time',
  psFwdT: 'PS Forward Time',
  psFwdDT: 'PS Forward Delay Time',
  psRevT: 'PS Reverse Time',
  psRevDT: 'PS Reverse Delay Time',
  cwAvailable: 'CW Available',
  cwFwdT: 'CW Forward Time',
  cwFwdDT: 'CW Forward Delay Time',
  cwRevT: 'CW Reverse Time',
  cwRevDT: 'CW Reverse Delay Time',
  cwDownT: 'CW Down Time',
  cwDownDT: 'CW Down Delay Time',
  cwUpT: 'CW Up Time',
  cwUpDT: 'CW Up Delay Time',
  cwFlowRate: 'CW Flow Rate',
};

const groupedFields = {
  'Press Details': ['pressSize', 'maxChamber', 'cakeAirT', 'cyFwdT', 'cyRevT'],
  'DT Details': ['dtAvailable', 'dtOpenT', 'dtClosedT'],
  'PS Details': ['psAvailable', 'psFwdFPlateT', 'psFwdT', 'psFwdDT', 'psRevT', 'psRevDT'],
  'CW Details': ['cwAvailable', 'cwFwdT', 'cwFwdDT', 'cwRevT', 'cwRevDT', 'cwDownT', 'cwDownDT', 'cwUpT', 'cwUpDT', 'cwFlowRate']
};

const pressFormConfig = {
  initialState,
  placeholders,
  labels,
  groupedFields
};

export default pressFormConfig;