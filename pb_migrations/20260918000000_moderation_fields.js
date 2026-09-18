migrate((app) => {
	const collection = app.findCollectionByNameOrId("cityInbox");

	collection.fields.add(
		new SelectField({
			name: "moderationStatus",
			values: ["pending", "approved", "merged", "rejected"],
			maxSelect: 1,
			default: "pending",
		}),
	);
	collection.fields.add(
		new DateField({
			name: "reviewedAt",
		}),
	);
	collection.fields.add(
		new TextField({
			name: "reviewedBy",
			max: 255,
		}),
	);
	collection.fields.add(
		new TextField({
			name: "reviewNote",
			max: 2000,
		}),
	);

	app.save(collection);

	collection.listRule = "approved = true";
	collection.viewRule = "approved = true";
	collection.createRule = "@request.body.approved = false && @request.body.moderationStatus = 'pending'";
	collection.updateRule = null;
	collection.deleteRule = null;

	const moderationStatus = collection.fields.getByName("moderationStatus");
	const reviewedAt = collection.fields.getByName("reviewedAt");
	const reviewedBy = collection.fields.getByName("reviewedBy");
	const reviewNote = collection.fields.getByName("reviewNote");
	moderationStatus.hidden = true;
	reviewedAt.hidden = true;
	reviewedBy.hidden = true;
	reviewNote.hidden = true;
	app.save(collection);

	const cityRepo = app.findCollectionByNameOrId("cityRepo");
	cityRepo.createRule = null;
	cityRepo.deleteRule = null;
	app.save(cityRepo);

	for (const record of app.findRecordsByFilter("cityInbox", "id != \"\"", "", 0, 0)) {
		if (!record) continue;
		record.set("moderationStatus", record.getBool("approved") ? "approved" : "pending");
		app.save(record);
	}
}, (app) => {
	const collection = app.findCollectionByNameOrId("cityInbox");
	collection.fields.removeByName("moderationStatus");
	collection.fields.removeByName("reviewedAt");
	collection.fields.removeByName("reviewedBy");
	collection.fields.removeByName("reviewNote");
	app.save(collection);
});
