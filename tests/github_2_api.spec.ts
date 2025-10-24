const { test, expect } = require('@playwright/test');

const owner = 'lruizajax';  // 👈 cambia esto
const repoName = `repo-test-${Date.now()}`;
const collaborator1 = 'user1';   // 👈 cambia esto
const collaborator2 = 'user2';

test.describe('GitHub API Tests add Repo, add Colaborars, remove Repo', () => {

  test('Crear repositorio y agregar colaboradores', async ({ request }) => {
    const createRepoResponse = await request.post('/user/repos', {
      data: {
        name: repoName,
        description: 'Repositorio creado automáticamente con Playwright',
        private: false
      }
    });

    expect(createRepoResponse.status()).toBe(201);
    const repoData = await createRepoResponse.json();
    console.log(`✅ Repositorio creado: ${repoData.html_url}`);

    //Agregar primer colaborador
    const addUser1 = await request.put(`/repos/${owner}/${repoName}/collaborators/${collaborator1}`, {
      data: { permission: 'push' } // push = puede subir cambios
    });

    expect([201, 204]).toContain(addUser1.status());
    console.log(`👥 ${collaborator1} agregado al repositorio: ${repoName} `);

    //Agregar segundo colaborador
    const addUser2 = await request.put(`/repos/${owner}/${repoName}/collaborators/${collaborator2}`, {
      data: { permission: 'push' }
    });

    expect([201, 204]).toContain(addUser2.status());
    console.log(`👥 ${collaborator2} agregado al repositorio: ${repoName} `);

    
    //Verificar lista de colaboradores
    const collaboratorsResponse = await request.get(`/repos/${owner}/${repoName}/collaborators`);
    expect(collaboratorsResponse.status()).toBe(200);

    const collaborators = await collaboratorsResponse.json();
    const collaboratorUsernames = collaborators.map(c => c.login);

    console.log(`📋 Colaboradores actuales:`, collaboratorUsernames);
    expect(collaboratorUsernames).toContain(owner);

  });

  //Eliminar repositorio al finalizar
  test.afterAll(async ({ request }) => {
    if (!repoName) return;
    const deleteRepo = await request.delete(`/repos/${owner}/${repoName}`);
    if (deleteRepo.status() === 204) {
      console.log(`🧹 Repositorio eliminado correctamente: ${repoName}`);
    } else {
      console.log(`⚠️ No se pudo eliminar el repositorio: ${repoName}`);
    }
  });

});
