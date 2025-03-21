const chai = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const express = require('express');

const noteRoutes = require('../routes/note.routes');
const noteController = require('../controllers/note.controller');

const { expect } = chai;

const app = express();
app.use(express.json());
app.use('/api', noteRoutes);

describe('Note API - Update Note', () => {
    let api;

    before(() => {
        api = supertest(app);
    });

    afterEach(() => {
        sinon.restore();
    });

    const updatedData = {
        title: 'Updated Title',
        content: 'Updated Content'
    };

    describe('PUT /api/notes/:id', () => {
        context('when the note exists', () => {
            it('returns status 200 and the updated note', async () => {
                sinon.stub(noteController, 'update').resolves(updatedData);

                const res = await api.put('/api/notes/42').send(updatedData);

                expect(res.status).to.equal(200);
                expect(res.body).to.include({
                    status: 'success',
                    message: 'Note updated successfully'
                });
                expect(res.body.note).to.deep.equal(updatedData);
            });
        });

        context('when the note does not exist', () => {
            it('returns status 404 and an error message', async () => {
                sinon.stub(noteController, 'update').resolves(null);

                const res = await api.put('/api/notes/999').send(updatedData);

                expect(res.status).to.equal(404);
                expect(res.body).to.have.property('message', 'Note not found');
            });
        });
    });
});
