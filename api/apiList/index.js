export default axios => ({
  // 专题页客户留资
  saveCustomer(params) {
    let url = 'https://zcloud.i72.com/?traceId=&linkId=f2b114f3d1b84768aa1e3310a106294f&sourceAccount=null&customerAttribution=10&fromPage=&convertId=&source=official_website_pc&keyword='
    if(['dev', 'test'].includes(process.env.PATH_TYPE)) {
      url = window.location.href;
    }
    return axios.post(`/api/customerInfo/save`, {
      ...params,
      url
    }, {
      headers: {
        "Content-Type": "application/json",
        sysCode: "activity",
      },
      baseURL: process.env.ACT_PATH,
      withCredentials: false
    });
  },
})