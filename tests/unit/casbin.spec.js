/* eslint-disable */
import { newModelFromString, StringAdapter } from 'casbin';
import { $Casbin } from '@/plugins/casbin';

// model
const basicModel = `
[request_definition]
r = sub, obj, act
[policy_definition]
p = sub, obj, act
[role_definition]
g = _, _
[policy_effect]
e = some(where (p.eft == allow))
[matchers]
m = (g(r.sub, p.sub) || r.sub == p.sub) && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act)
`;

// adapter
const basicPolicy = `
p, ADMIN, /usuarios, (GET)|(POST)
g, admin, ADMIN
`;

const model = newModelFromString(basicModel);
const policy = new StringAdapter(basicPolicy);

async function setTimeout(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function iniciado() {
  return new Promise(resolve => {
    const sInt = setInterval(() => {
      if ($Casbin.enforcer) {
        clearInterval(sInt);
        resolve(true);
      }
    }, 100);
  });
}

describe('Plugin ', () => {
  it('Casbin iniciado correctamente, tiempo =', done => {
    iniciado().then(r => {
      expect(r).toBe(true);
      done();
    });
  });

  it('Obtener politicas iniciales', done => {
    $Casbin.enforcer.getPolicy().then(p => {
      expect(p).toEqual(expect.arrayContaining([]));
      done();
    });
  });

  it('Cargar politicas adicionales', async () => {
    await $Casbin.enforcer.addPolicy('ADMIN', '/usuarios', 'read|create|update');
    const p = await $Casbin.enforcer.getPolicy();
    expect(p).toEqual(expect.arrayContaining([['ADMIN', '/usuarios', 'read|create|update']]));
  });

  it('Verificar permisos de ADMIN', async () => {
    let permitido;
    permitido = await $Casbin.enforcer.enforce('ADMIN', '/usuarios', 'read');
    expect(permitido).toBe(true);
    permitido = await $Casbin.enforcer.enforce('ADMIN', '/usuarios', 'delete');
    expect(permitido).toBe(false);
  });

  it('Veriricar otros permisos no validos', done => {
    $Casbin.enforcer.enforce('ADMIN', '/usuarios', 'raed').then(permitido => {
      expect(permitido).toBe(false);

      $Casbin.enforcer.enforce('OTRO', '/usuarios', 'read').then(permitido => {
        expect(permitido).toBe(false);

        done();
      });
    });
  });
});
