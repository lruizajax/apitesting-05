const { test, expect } = require('@playwright/test');

// variables
const owner = 'lruizajax';
const repoName = `repo-${Date.now()}`;
const user1 = 'admin1';
const user2 = 'admin2';

test.describe('GitHub API Tests', () => {

    test('Create Repository & add colaborators', async ({ request }) => {

        //crear un repositorio
        const createRepoResponse = await request.post('/user/repos', {
            data: {
                name: repoName,
                description: 'This is a test repository created via Playwright API testing',
                private: false
            }
        });

        console.log('Add Repo Status:', createRepoResponse.status());
        expect(createRepoResponse.status()).toBe(201);
        const createRepoResponseBody = await createRepoResponse.json();
        console.log(`✅ Repositorio creado: ${createRepoResponseBody.html_url}`);

        //agregar primer colaborador
        const addUserResponse = await request.put(`/repos/${owner}/${repoName}/collaborators/${user1}`, {
            data: { permission: 'push' } // push = puede subir cambios
        });

        console.log('Add User 1 Status:', addUserResponse.status());
        if (addUserResponse.status() === 201) {
            const body = await addUserResponse.json();
            console.log('✅ Invitación enviada a:', body.invitee.login);
            console.log('🔗 URL de invitación:', body.html_url);
        } else if (addUserResponse.status() === 204) {
            console.log(`⚙️ El usuario ${user1} ya es colaborador del repositorio.`);
        } else {
            const errorBody = await addUserResponse.json();
            console.log('❌ Error:', errorBody.message);
        }

        //agregar segundo colaborador
        const addUserResponse2 = await request.put(`/repos/${owner}/${repoName}/collaborators/${user2}`, {
            data: { permission: 'push' } // push = puede subir cambios
        });

        console.log('Add User 2 Status:', addUserResponse2.status());
        if (addUserResponse2.status() === 201) {
            const body = await addUserResponse2.json();
            console.log('✅ Invitación enviada a:', body.invitee.login);
            console.log('🔗 URL de invitación:', body.html_url);
        } else if (addUserResponse2.status() === 204) {
            console.log(`⚙️ El usuario ${user1} ya es colaborador del repositorio.`);
        } else {
            const errorBody = await addUserResponse2.json();
            console.log('❌ Error:', errorBody.message);
        }

    });

});