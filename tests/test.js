var NotificationService = require("../services/notification-services");
var notification_service = new NotificationService(null, null, null, null);

var token = [
    "eVSIySygDR0:APA91bEIoV16DJ0o0II7CWot9lsSkMJybRIDLoUekheb9d5bnVH6axb1jmEa-6ep4kEh80645wqx_W3S6KSYwJEvD2oJQ4EW1gLEuBADVfVmFWIKPfvUMMtsPCxEilEZNTjQmF9P7wOu",
    "dA1OhFMiQmc:APA91bH3ssA7XGgRXtks7wQB_GQf5ZHyrDIQ9WbjfRESXEpBhJK4-J52qjznzeEZG-gB8lHsftUgp0O-SP0bo4j1Q_9inDPMdpqSrjFITrOAAKRajRDqywSINNOv4jUwyjqL4rqiFQFL"];

var notification_obj = {
    type: "1:02",
    sound: "zzz.mp3",
    alert: "lô a",
    data: { product_id: 5 }
}

notification_service.send_to_device(token, notification_obj, function (err, res) {
    if (err) throw err;
    console.log(res);
});