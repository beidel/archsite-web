(function () {
    define([], function () {
        function LayerModel() {
            if (typeof LayerModel.instance === "object") {
                return LayerModel.instance;
            }

            this.layers = [];

            LayerModel.instance = this;

            return new LayerModel();
        };
    });

}());