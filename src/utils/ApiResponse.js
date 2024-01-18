class ApiReponse {

constructor(statusCode,data,message ="Sucess"){
    this.statusCOde = statusCode
    this.data =data
    this.message =message
    this.success = statusCode <400
}
}