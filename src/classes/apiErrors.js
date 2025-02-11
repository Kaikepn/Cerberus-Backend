class apiErrors extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
    }
}
export default apiErrors;