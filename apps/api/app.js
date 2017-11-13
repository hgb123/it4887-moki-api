var express = require("express");
var queryhandler = require("express-api-queryhandler");
var body_parser = require("body-parser");
var config = require("../../config/config");

/* ===== Express setup ===== */
var app = express();
app.use(queryhandler.filter());
app.use(queryhandler.pagination({ limit: 1000 }));
app.use(queryhandler.sort());
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json({
    verify: function (req, res, buf, encoding) {
        req.raw_body = buf;
    }
}));
/* ===== End Express setup ===== */

/* ===== Components setup ===== */
// DataContext
var mysql_data_context = require("../../repository/mysql-context")(config.mysql);

// Repository
var UserRepository = require("../../repository/user-repository");
var PushSettingRepository = require("../../repository/push-setting-repository");
var FollowRepository = require("../../repository/follow-repository");
var BlockRepository = require("../../repository/block-repository");
var ConversationRepository = require("../../repository/conversation-repository");
var ProductRepository = require("../../repository/product-repository");
var SearchHistoryRepository = require("../../repository/search-history-repository");
var BrandRepository = require("../../repository/brand-repository");
var CategoryRepository = require("../../repository/category-repository");
var ProductCategoryRepository = require("../../repository/product-category-repository");
var LikeRepository = require("../../repository/like-repository");
var CommentRepository = require("../../repository/comment-repository");

var user_repository = new UserRepository(mysql_data_context);
var push_setting_repository = new PushSettingRepository(mysql_data_context);
var follow_repository = new FollowRepository(mysql_data_context);
var block_repository = new BlockRepository(mysql_data_context);
var conversation_repository = new ConversationRepository(mysql_data_context);
var product_repository = new ProductRepository(mysql_data_context);
var search_history_repository = new SearchHistoryRepository(mysql_data_context);
var brand_repository = new BrandRepository(mysql_data_context);
var category_repository = new CategoryRepository(mysql_data_context);
var product_category_repository = new ProductCategoryRepository(mysql_data_context);
var like_repository = new LikeRepository(mysql_data_context);
var comment_repository = new CommentRepository(mysql_data_context);

// Service
var AuthenService = require("../../services/authen-services");
var UserService = require("../../services/user-services");
var NotificationService = require("../../services/notification-services");
var ConversationService = require("../../services/conversation-services");
var TokenService = require("../../services/token-services");
var ProductService = require("../../services/product-services");
var SearchHistoryService = require("../../services/search-history-services");
var BrandService = require("../../services/brand-services");
var CategoryService = require("../../services/category-services");
var CommentService = require("../../services/comment-services");

var authen_service = new AuthenService(user_repository);
var user_service = new UserService(user_repository, follow_repository, block_repository);
var notification_service = new NotificationService(user_repository, follow_repository, product_repository, push_setting_repository);
var conversation_service = new ConversationService(conversation_repository, user_repository);
var token_service = new TokenService();
var product_service = new ProductService(product_repository, category_repository, product_category_repository, brand_repository, like_repository, comment_repository, user_repository, block_repository, notification_service);
var search_history_service = new SearchHistoryService(search_history_repository);
var brand_service = new BrandService(brand_repository);
var category_service = new CategoryService(category_repository);
var comment_service = new CommentService(comment_repository, user_repository, notification_service);

// Controller
var AuthenController = require("./controllers/authen-controller");
var UserController = require("./controllers/user-controller");
var NotificationController = require("./controllers/notification-controller");
var ConversationController = require("./controllers/conversation-controller");
var ProductController = require("./controllers/product-controller");
var SearchHistoryController = require("./controllers/search-history-controller");
var BrandController = require("./controllers/brand-controller");
var CategoryController = require("./controllers/category-controller");
var CommentController = require("./controllers/comment-controller");

var authen_controller = new AuthenController(authen_service, token_service);
var user_controller = new UserController(user_service);
var notification_controller = new NotificationController(notification_service);
var conversation_controller = new ConversationController(conversation_service);
var product_controller = new ProductController(product_service);
var search_history_controller = new SearchHistoryController(search_history_service);
var brand_controller = new BrandController(brand_service);
var category_controller = new CategoryController(category_service);
var comment_controller = new CommentController(comment_service);


/* ===== End Components setup  ===== */

require("./routes/authen-routes")(app, authen_controller, notification_controller);
require("./routes/user-routes")(app, user_controller, product_controller);
require("./routes/notification-routes")(app, notification_controller);
require("./routes/conversation-routes")(app, conversation_controller);
require("./routes/product-routes")(app, product_controller, comment_controller, search_history_controller);
require("./routes/search-history-routes")(app, search_history_controller);
require("./routes/brand-routes")(app, brand_controller, product_controller);
require("./routes/category-routes")(app, category_controller, product_controller);

var server = require("http").Server(app);
var chat_app = require("../chat/app")(server, conversation_service, notification_service);

app.use(function (err, req, res, next) {
    console.error(new Date());
    console.error(err);
    if (err.type) {
        switch (err.type) {
            case "Bad Request":
                return res.status(400).send({ error: "Bad Request" });
            case "Unauthorized":
                return res.status(401).send({ error: "Unauthorized" });
            case "Request Failed":
                return res.status(402).send({ error: "Request Failed" });
            case "Not Found":
                return res.status(404).send({ error: "Not Found" });
            case "Duplicated":
                return res.status(409).send({ error: "Duplicated" });
        }
    }

    return res.status(500).send({ error: "Something Failed" });
});

var port = config.port;
var env = process.env.NODE_ENV;
server.listen(port, function () {
    console.log("Environment:", env);
    console.log("Server is listening on port:", port);
});

module.exports = app;