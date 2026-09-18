// Follow-up for 20260918000000_moderation_fields.js: `moderationStatus` is a
// hidden (superuser-only) field, so the previous createRule could never match
// for public submissions. The `pending` default on the field makes the extra
// body assertion unnecessary.
migrate((app) => {
	const collection = app.findCollectionByNameOrId("cityInbox");
	collection.createRule = "@request.body.approved = false";
	app.save(collection);
}, (app) => {
	const collection = app.findCollectionByNameOrId("cityInbox");
	collection.createRule = "@request.body.approved = false && @request.body.moderationStatus = 'pending'";
	app.save(collection);
});
