export default function createNotification(db, username, notification) {
    let notifications = db.get(`users.${username}.notifications`) || [];

    notifications.push({
        type: notification.type,
        from: notification.from,
        content: notification.content,
        date: Date.now(),
    });

    db.set(`users.${username}.notifications`, notifications);

    return true;
}
