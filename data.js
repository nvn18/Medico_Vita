const { MongoClient } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;


// Connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//app.use(bodyParser.urlencoded({extended : false}));
// Use bodyParser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));


// Serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, 'public')));


app.post('/submit-form', async (req, res) => {
    try {
        // Connect to MongoDB
        await client.connect();

        const database = client.db('medico_vita_db');
        const formCollection = database.collection('form_submissions');
        const doctorsCollection = database.collection('doctors');


        // Collect form data
        const formData = {
            name: req.body.name,
            phone: req.body.phone,
            medical_scheme: req.body.medical_scheme,
            email: req.body.email,
            age_group: req.body.age_group,
            date_of_birth: req.body.date_of_birth,
            symptoms: req.body.symptoms,
            suspected_disease: req.body.suspected_disease,
            timestamp: new Date()
        };
        // Insert form data into MongoDB named doctors .. in the form of Arrays 
        await formCollection.insertOne(formData);

        // Check doctors' database for matching doctors from the mongodb
        const matchingDoctors = await doctorsCollection.find({ treated_diseases: formData.symptoms }).toArray();
        
        if (matchingDoctors.length > 0) {
            // Retrieve doctors' names, medicines, and photos from the ['doctors'] DB
            const doctorDetails = matchingDoctors.map(doctor => ({
                name: doctor.name,
                medicines: doctor.medicines,
                photo: doctor.photo
            }));


            // Create an HTML response with inline CSS that adds the styles to the last forms page
            let responseHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Form Submission</title>
                    <style>
                        body {
                            background-color: coral;
                            font-family: Arial, sans-serif;
                        }
                        .doctor-box {
                            border: 1px solid #fff;
                            padding: 20px;
                            margin: 20px;
                            background-color: lightblue;
                            border-radius: 5px;
                            display: flex;
                            align-items: center;
                        }
                        .doctor-photo {
                            width: 100px;
                            height: 100px;
                            border-radius: 50%;
                            margin-right: 20px;
                        }
                        .doctor-name {
                            font-size: 20px;
                            font-weight: bold;
                        }
                        .medicine-list {
                            margin-top: 10px;
                        }
                    </style>
                </head>
                <body>
                    <h1>Form submitted successfully</h1>
                    <div>
                        <h2>Matching Doctors:</h2>
            `;

            doctorDetails.forEach(doctor => {
                responseHtml += `
                    <div class="doctor-box">
                        <img src="/public/${doctor.photo}" alt="${doctor.name}'s photo" class="doctor-photo">
                        <div>
                            <div class="doctor-name">${doctor.name}</div>
                            <div class="medicine-list">
                                <strong>Medicines:</strong> ${doctor.medicines.join(', ')}
                            </div>
                        </div>
                    </div>
                `;
            });

            responseHtml += `
                    </div>
                </body>
                </html>
            `;

            console.log('Matching doctors:', doctorDetails);
            res.send(responseHtml);
        } else {
            console.log('No matching doctors found.');
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Form Submission</title>
                    <style>
                        body {
                            background-color: coral;
                            font-family: Arial, sans-serif;
                        }
                    </style>
                </head>
                <body>
                    <h1>Form submitted successfully</h1>
                    <div>
                        <h2>No matching doctors found.</h2>
                    </div>
                </body>
                </html>
            `);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        // Close MongoDB connection
        await client.close();
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
