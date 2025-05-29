const functions = require('@google-cloud/functions-framework');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('./service-account.json')),
});

const messaging = admin.messaging();

const cors = require('cors')({ origin: true });

functions.http('sendSpeedAlert', async (req, res) => {
  cors(req, res, async () => { 
    try {
      const eventData = req.body;

      if (!eventData || !eventData.value || !eventData.value.fields) {
        return res.status(400).send('Bad Request: Missing data');
      }

      const beforeData = eventData.oldValue ? eventData.oldValue.fields : {};
      const afterData = eventData.value.fields;

      const getFieldValue = (field) =>
        field?.integerValue || field?.doubleValue || field?.stringValue || null;

      const speedBefore = getFieldValue(beforeData.speed) || 0;
      const speedAfter = getFieldValue(afterData.speed);
      const resourcePath = eventData?.value?.name || '';
      const vehicleId = resourcePath.split('/').pop();

      const speedLimit = 65;

      if (speedAfter > speedLimit && speedBefore <= speedLimit) {
        const message = {
          notification: {
            title: 'Speed Limit Exceeded',
            body: `Vehicle ${vehicleId} exceeded speed limit: ${speedAfter} mph`,
          },
          topic: 'fleet_supervisors',
        };

        await messaging.send(message);
        console.log(`Notification sent for Vehicle ${vehicleId}`);
      }

      res.status(200).send('Processed successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
});