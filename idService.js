var IdService = function() {
    this.id = 0;
};

IdService.prototype.getNext = function() {
    return 'formId' + this.id++;
}

module.exports = new IdService();