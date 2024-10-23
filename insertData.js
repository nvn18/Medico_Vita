const { MongoClient } = require('mongodb');

async function insertDoctorData() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('medico_vita_db');
        const doctorsCollection = database.collection('doctors');

        const doctors = [
            {
                name: 'Dr. Neeraj',
                treated_diseases: ['fever', 'cold','heart pain','headache'],
                medicines: ['Paracetamol', 'Ibuprofen','Nitroglycerin or Aspirin'],
                photo: 'nv.jpg' 
            },
            {
                name: 'Dr. Tayyab',
                treated_diseases: ['headache', 'migraine',],
                medicines: ['Aspirin', 'Sumatriptan'],
                photo: 'tayyab.jpg' 
            },
            {
                name: 'Dr. Sathish',
                treated_diseases: ['headache', 'migraine'],
                medicines: ['Aspirin', 'Sumatriptan'],
                photo: 'sathish.jpg' 
            },
            {
                name: 'Dr. Karthik',
                treated_diseases: ['Stomach pain', 'migraine'],
                medicines: ['loperamide (Imodium) or bismuth subsalicylate (Kaopectate or Pepto-Bismol)', 'Sumatriptan'],
                photo: 'karthik.jpg' 
            },
            {
                name: 'Dr. Roshan',
                treated_diseases: ['Stomach pain', 'migraine'],
                medicines: ['loperamide (Imodium) or bismuth subsalicylate (Kaopectate or Pepto-Bismol)', 'Sumatriptan'],
                photo: 'roshan.png' 
            },
            {
                name: 'Dr. Manoj',
                treated_diseases: ['fever', 'cold','heart pain'],
                medicines: ['Paracetamol', 'Ibuprofen','Nitroglycerin or Aspirin'],
                photo: 'manoj.png' 
            },
            {
                name: 'Dr. Shreyas',
                treated_diseases: ['headache', 'migraine',],
                medicines: ['Aspirin', 'Sumatriptan'],
                photo: 'shreyas.png'
            }
        ];

        await doctorsCollection.insertMany(doctors);
        console.log('Doctor data inserted successfully');
    } finally {
        await client.close();
    }
}

insertDoctorData().catch(console.error);
