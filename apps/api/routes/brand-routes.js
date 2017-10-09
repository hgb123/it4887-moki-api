module.exports = function (app, brand_controller) {
    app.get("/api/brands",
        brand_controller.retrieve_all,
        function (req, res) {
            return res.status(200).send(res.brands);
        }
    );

    app.get("/api/brands/:brand_id",
        brand_controller.retrieve_one,
        function (req, res) {
            return res.status(200).send(res.brand);
        }
    );
}