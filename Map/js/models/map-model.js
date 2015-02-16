(function () {
    define([], function () {
        function MapModel() {
            if (typeof MapModel.instance === "object") {
                return MapModel.instance;
            }

            this.mapObject = null;

            this.itemInfo = null;

            this.layerInfos = null;

            this.response = null;

            MapModel.instance = this;

            return new MapModel();
        };
    });

}());