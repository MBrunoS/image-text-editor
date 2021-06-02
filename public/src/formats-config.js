const formats = {
  feed: {
    width: 1080, height: 1080,
    day: { colors: ['#000000', '#ffc300'], size: 35 },
    address: { colors: ['#000000'], size: 30 }
  },
  story: {
    width: 1080, height: 1920,
    day: { colors: ['#000000'], size: 35 },
    address: { colors: ['#000000'], size: 30 }
  },
  wide: {
    width: 1920, height: 1080,
    day: { colors: ['#000000'], size: 35 },
    address: { colors: ['#000000'], size: 30 }
  },
  panfleto: {
    width: 2480, height: 3508,
    font: 'Bebas Neue',
    day: { colors: ['#000000'], size: 100 },
    address: { colors: ['#000000'], size: 100 }
  }
};

export default formats;