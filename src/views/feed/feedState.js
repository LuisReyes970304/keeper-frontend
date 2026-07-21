export const feedState = {
  listUsers: [],

  listReportesFeed: [],

  showingThreeDays: false,

  data30Days: {
    trend: '+12.4% vs mes anterior',
    bars: ['60%', '70%', '50%', '80%', '90%', '60%', '70%'],
    active: '28',
    responseTime: '4m 12s',
    sectores: { norte: 42, central: 29, industrial: 64 },
    reports: []
  },

  data3Days: {
    trend: '+18.2% vs semana anterior',
    bars: ['20%', '35%', '30%', '50%', '95%', '90%', '85%'],
    active: '9',
    responseTime: '2m 45s',
    sectores: { norte: 12, central: 8, industrial: 22 },
    reports: []
  },

  listHistorialReportes: []
};
