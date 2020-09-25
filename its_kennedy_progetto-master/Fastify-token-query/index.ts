import * as fastify from 'fastify';
import * as cors from 'fastify-cors';
import * as jwt from 'fastify-jwt';
import * as swagger from 'fastify-swagger';
import * as bcrypt from 'bcrypt';

import { TokenRequest } from './Models/TokenRequest';

import * as mysql from 'mysql';

var connection = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'Vmware1!',
    database: 'ITS_KENNEDY'
});

const saltRound = 10;


const app = fastify({
    logger: true,
    ignoreTrailingSlash: true
});

app.register(cors);
app.register(jwt, { secret: "chiave-super-segreta" });

app.register(swagger, {
    routePrefix: '/documentation',
    swagger: {
        info: {
            title: 'Test ITS JWT autentication',
            description: 'testing the fastify swagger api',
            version: '0.1.0'
        },
        externalDocs: {
            url: 'https://www.tecnicosuperiorekennedy.it',
            description: 'ITS'
        },
        host: 'localhost:3000',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json']
    },
    exposeRoute: true
});


app.post('/api/register', (request, reply) => {
    var saltRounds = 10;
    var username = request.body.username;
    var password = request.body.password;
    var email = request.body.email;
    var Nome_Admin = request.body.Nome_Admin;
    var Cognome_Admin = request.body.Cognome_Admin;
    var RUOLO=request.body.RUOLO;
    var Admin_Status=request.body.Admin_Status;
    bcrypt.hash(password, saltRound).then(value => {
        connection.query("INSERT INTO admin (username, password, email,Nome_Admin,Cognome_Admin, RUOLO,Admin_Status) VALUES(?,?,?,?,?,?,?)",
            [username, value, email, Nome_Admin, Cognome_Admin,RUOLO,Admin_Status],
            (error, results, fields) => {
                reply.status(201).send({ result: true }); // 201 created
            }).catch(reason => {
                reply.status(500).send({
                    result: false,
                    errorText: "Errore nel calcolo dell'hash della password",
                    reason: reason
                });
            });
    });
});


const tokenJsonSchema = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
        username: { type: 'string', minLength: 4 },
        password: { type: 'string', minLength: 4 }
    }
};
app.post('/api/token', { schema: { body: tokenJsonSchema } }, (request, reply) => {
    // some code
    let model = request.body as TokenRequest;

    connection.query("SELECT username,idADMIN,Nome_Admin,Cognome_Admin ,RUOLO,Admin_Status, password FROM admin where username = ?", model.username, (error, results, fields) => {
        if (error) {
            reply.status(500).send({ error: error.message });
        }
        else if (results.length == 0) {
            reply.status(401).send({
                statusCode: 401,
                error: "Unauthorized",
                message: "Inavalid username or password."
            });
        }
        else {
            bcrypt.compare(model.password, results[0].password, function (err, result) {
                if (result) {
                    console.log(results[0]);
                    const token = app.jwt.sign({ Username: results[0].username, Nome_Admin: results[0].Nome_Admin, Cognome_Admin: results[0].Cognome_Admin,RUOLO: results[0].RUOLO ,idADMIN:results[0].idADMIN,Admin_Status:results[0].Admin_Status});
                    reply.send({ token });
                }
                else {
                    reply.status(401).send({
                        statusCode: 401,
                        error: "Unauthorized",
                        message: "Inavalid username or password.",
                        body: results
                    });
                }
            });
        }
    });
});

app.register(async function (fastify, opts) {
    fastify.addHook("onRequest", async (request, reply) => {
        try {
            await request.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    });

    fastify.get('/api/time', async (request, reply) => {
        let jwtPayload = request.user;

        return {
            now: new Date(),
            user: jwtPayload
        };
    });
});
// --------------------------------------------------------------------------------------------------------------------------------------
app.get('/api/sede', (request, reply) => {
    connection.query("select * from sede ", (error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results)

    });
});
app.get('/api/sede/:id', (request, reply) => {
    connection.query("select * from sede where idSede=?",[request.params.id], (error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        if(results.length == 0)
            reply.status(404).send();
        else
            reply.send(results[0]);
    });
});
app.post('/api/sede', (request, reply) => {
    var sede = request.body;
    connection.query('insert into sede (Sede) values(?)',
        [sede.SEDE], (error, results, fields) => {
            if (error) {
                reply.status(500).send({ error: error.message });
                return;
            }
            app.log.info('Inserimento riuscito!');
            reply.status(201).send();
        });
});
app.get('/api/sede/admin/:id', (request, reply) => {
    connection.query("select ad.Sede_IdSede,ad.Admin_IdAdmin,a.Nome_Admin,a.Cognome_Admin,a.username,a.email,a.RUOLO, s.SEDE,s.IdSede from admin_has_sede as ad inner join sede as s on ad.SEDE_idSEDE=s.idSEDE  inner join admin as a on ad.Admin_IdAdmin=a.IdAdmin where Admin_IdAdmin=?",[request.params.id],(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results)
    });
});

app.get('/api/sede/admin/all/:id', (request, reply) => {
    connection.query("select admin.Nome_Admin,admin.Cognome_Admin,admin.RUOLO from admin_has_Sede inner join admin on admin_Has_Sede.Admin_IdAdmin=admin.IdAdmin where Sede_idSede=?",[request.params.id],(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results)
    });
});
app.post("/api/sede/admin", (request, reply) => {
    let a = request.body;
    connection.query("Insert into admin_has_sede (Admin_IdAdmin,Sede_IdSede)Values(?,?)",
        [a.Admin_IdAdmin,a.Sede_IdSede],
        (error, results, fields) => {
            if (error) {
                reply.status(500).send({ error: error.message });
                return;
            }
            reply.status(204).send(results);
        });
});

// ---------------------------------------------------------------------------------------------------------------------------------------
app.get('/api/admin', (request, reply) => {
    connection.query("select idADMIN, Nome_Admin, Cognome_Admin,username, email,RUOLO,Admin_Status from admin ", (error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results)

    });
});
app.get('/api/admin/:id', (request, reply) => {
    connection.query("select Nome_Admin,Cognome_Admin,username,email,RUOLO,Admin_Status from admin  where idADMIN=?",[request.params.id], (error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        if(results.length == 0)
            reply.status(404).send();
        else
            reply.send(results[0]);
    });
});
// ---------------studente-------------------------------------------------------------------------------------------------------------------------

app.get('/api/sede/:id/students', (request, reply) => {
    connection.query("select u.idUTENTE,u.nome,u.cognome,u.data_nascita,u.luogo_nascita,u.via,u.civico,u.comune,u.provincia_sigla, c.corso from utente as u inner join CORSO as c on u.CORSO_idCORSO=c.idCORSO inner join  sede as s on c.SEDE_idSEDE=s.idSEDE where c.SEDE_idSEDE=? and frequentazione=1 order by u.nome asc ",[request.params.id] ,(error, results, fields) => {
       app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results)

    });
});
app.get('/api/sede/students/:id', (request, reply) => {
    connection.query("select u.nome,u.cognome,u.data_nascita,u.luogo_nascita,u.via,u.civico,u.comune,u.provincia_sigla, c.corso from utente as u inner join CORSO as c on u.CORSO_idCORSO=c.idCORSO inner join  sede as s on c.SEDE_idSEDE=s.idSEDE where  u.idUTENTE=? ", [request.params.id], (error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        if (results.length == 0)
            reply.status(404).send();
        else
            reply.send(results[0]);
    });
});
// studenti in base al corso
app.get('/api/sede/:id/students/all',(request,reply)=>{
    connection.query("select u.idUTENTE,u.nome,u.cognome,u.data_nascita,u.luogo_nascita,u.via,u.civico,u.comune,u.provincia_sigla, c.corso from utente as u inner join CORSO as c on u.CORSO_idCORSO=c.idCORSO inner join  sede as s on c.SEDE_idSEDE=s.idSEDE where c.SEDE_idSEDE=? order by u.nome asc",[request.params.id],(error,results,fields)=>{
        app.log.info(results);
        app.log.info(fields);
        if(error){
            reply.status(500).send({error: error.message});
            return;
        }
        reply.send(results)
    });
}); 
app.get('/api/sede/movimento/:id', (request, reply) => {
    connection.query("select distinct(m.data_consegna),m.idMOVIMENTO,m.cavo_rete,m.alimentatore,m.borsa,m.mouse,m.hdd,m.con_ethernet,m.con_usb,m.note,m.note_movimento,m.data_consegna,m.ADMIN_idADMIN,M.UTENTE_idUTENTE,m.PC_idpc,u.nome,u.cognome,c.corso from movimento as m inner join  utente as u on m.UTENTE_idUTENTE=u.idUTENTE inner join pc on m.PC_idpc=pc.idpc inner join sede on pc.SEDE_idSEDE=sede.idSEDE inner join corso as c on u.CORSO_idCORSO=c.idCORSO where sede.idSEDE=?",[request.params.id] ,(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results)

    });
});
app.get('/api/sede/movimenti/:idmovimento', (request, reply) => {
    connection.query("select m.data_consegna,m.cavo_rete,m.alimentatore,m.borsa,m.mouse,m.hdd,m.con_ethernet,m.con_usb,m.note,m.note_movimento,m.data_consegna,m.ADMIN_idADMIN,M.UTENTE_idUTENTE,m.PC_idpc,u.nome,u.cognome,c.corso from movimento as m inner join  utente as u on m.UTENTE_idUTENTE=u.idUTENTE inner join pc on m.PC_idpc=pc.idpc inner join sede on pc.SEDE_idSEDE=sede.idSEDE inner join corso as c on u.CORSO_idCORSO=c.idCORSO where idMOVIMENTO=?",[request.params.idmovimento] ,(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        if(results.length == 0)
            reply.status(404).send();
        else
            reply.send(results[0]);

    });
});
app.post('/api/students',(request,reply)=>{
    let u = request.body;
    let date = new Date(u.data_nascita);
    connection.query('Insert into utente (nome,cognome,data_nascita,luogo_nascita,via,civico,comune,provincia_sigla,CORSO_idCORSO,frequentazione) Values(?,?,?,?,?,?,?,?,?,?)',
        [u.nome, u.cognome, date, u.luogo_nascita, u.via, u.civico, u.comune, u.provincia_sigla,u.CORSO_idCORSO, u.frequentazione],
        (error, results, fields) => {
            if (error) {
                reply.status(500).send({ error: error.message });
                return;
            }
            reply.status(204).send(results);
        });
})
app.put('/api/sede/students/:id',(request,reply)=>{
    let utente=request.body;
    connection.query("update utente set frequentazione=? where idUTENTE=?",[utente.frequentazione,request.params.id],(error,results,fields)=>{
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(304).send({ error: error.message });
            return;
        }
        reply.status(200).send({message:"modificato studente "+request.params.id});
    })
})

// ----------corso------------------------------------------------------------------------------------------------------------------------------------
app.get('/api/corso/:id', (request, reply) => {
    connection.query("select * from corso  where Sede_idSede=?",[request.params.id], (error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results)

    });
});

app.post('/api/corso', (request, reply) => {
    var C = request.body;
    connection.query('insert into corso (CORSO,SEDE_idSEDE) values(?,?)',
        [C.CORSO,C.SEDE_idSEDE], (error, results, fields) => {
            if (error) {
                reply.status(500).send({ error: error.message });
                return;
            }
            app.log.info('Inserimento riuscito!');
            reply.status(201).send();
        });
});
// -----stato----------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/api/stato/ritiro', (request, reply) => {
    connection.query("select idSTATO,ritiro from stato where ritiro=1;", (error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        if(results.length == 0)
            reply.status(404).send();
        else
            reply.send(results[0]);
    });
});

app.get('/api/stato/consegna', (request, reply) => {
    connection.query("select idSTATO,consegna from stato where consegna=1;", (error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        if(results.length == 0)
            reply.status(404).send();
        else
            reply.send(results[0]);
    });
});

app.get('/api/stato/guasto', (request, reply) => {
    connection.query("select idSTATO,guasto from stato where guasto=1;", (error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        if(results.length == 0)
            reply.status(404).send();
        else
            reply.send(results[0]);
    });
});

app.get('/api/stato/riparazione', (request, reply) => {
    connection.query("select idSTATO,riparazione from stato where riparazione=1;", (error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        if(results.length == 0)
            reply.status(404).send();
        else
            reply.send(results[0]);
    });
});

app.get('/api/stato/KO', (request, reply) => {
    connection.query("select idSTATO,KO from stato where KO=1;", (error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        if(results.length == 0)
            reply.status(404).send();
        else
            reply.send(results[0]);
    });
});



// ---------Inserimento---------------------------------------------------------------------------------------
app.get('/api/sede/hw', (request, reply) => {
    connection.query("select * from hw ", (error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results)

    });
});


app.post('/api/sede/hw', (request, reply) => {
    let hw=request.body;
    connection.query("INSERT INTO HW (Cpu,Ram,Memoria,Tipo_Memoria,marca,Modello) VALUES(?,?,?,?,?,?)", 
    [hw.Cpu,hw.Ram,hw.Memoria,hw.Tipo_memoria,hw.marca,hw.modello], (error, results, fields)=>{      
        if(error){
            reply.status(500).send({error: error.message});
            return;
        }
        reply.status(201).send();
    });
});


// --------------------------------------------------------------------------------------------------------------------------------
app.get('/api/sede/:id/pc', (request, reply) => {
    connection.query("select pc.idpc,pc.HW_idHW,pc.Seriale,pc.n_inventario,pc.n_fattura,pc.data_Acquisto,pc.note,pc.SEDE_idSEDE,pc.STATO_idSTATO,stato.ritiro,stato.consegna,stato.guasto,stato.riparazione,stato.ko,hw.cpu,hw.ram,hw.Memoria,hw.Tipo_memoria,hw.marca,hw.modello from pc inner join stato on pc.stato_idStato=stato.IdStato inner join hw on pc.HW_idHW=hw.IDhw where sede_idsede=? ",[request.params.id] ,(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results)


    });
});


app.get('/api/sede/:id/pc_stato/disponibili', (request, reply) => {
    let pc=request.body;
    connection.query("select pc.idpc,pc.HW_idHW,pc.Seriale,pc.n_inventario,pc.n_fattura,pc.data_Acquisto,pc.note,pc.SEDE_idSEDE,pc.STATO_idSTATO,stato.ritiro,stato.consegna,stato.guasto,stato.riparazione,stato.ko,hw.cpu,hw.ram,hw.Memoria,hw.Tipo_memoria,hw.marca,hw.modello from pc inner join stato on pc.stato_idStato=stato.IdStato inner join hw on pc.HW_idHW=hw.IDhw where sede_idsede=? and  STATO_idSTATO=1 || STATO_idSTATO=2;",[request.params.id] ,(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results)


    });
});

app.get('/api/sede/:id/pc_stato/consegna', (request, reply) => {
    
    connection.query("select pc.idpc,pc.HW_idHW,pc.Seriale,pc.n_inventario,pc.n_fattura,pc.data_Acquisto,pc.note,pc.SEDE_idSEDE,pc.STATO_idSTATO,stato.ritiro,stato.consegna,stato.guasto,stato.riparazione,stato.ko,hw.cpu,hw.ram,hw.Memoria,hw.Tipo_memoria,hw.marca,hw.modello from pc inner join stato on pc.stato_idStato=stato.IdStato inner join hw on pc.HW_idHW=hw.IDhw where sede_idsede=? and  STATO_idSTATO=3",[request.params.id],(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results)


    });
});
app.get('/api/sede/:id/pc_stato/ritiro', (request, reply) => {
    
    connection.query("select pc.idpc,pc.HW_idHW,pc.Seriale,pc.n_inventario,pc.n_fattura,pc.data_Acquisto,pc.note,pc.SEDE_idSEDE,pc.STATO_idSTATO,stato.ritiro,stato.consegna,stato.guasto,stato.riparazione,stato.ko,hw.cpu,hw.ram,hw.Memoria,hw.Tipo_memoria,hw.marca,hw.modello from pc inner join stato on pc.stato_idStato=stato.IdStato inner join hw on pc.HW_idHW=hw.IDhw where sede_idsede=? and  STATO_idSTATO=2",[request.params.id],(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results)


    });
});
app.get('/api/sede/:id/pc_stato/guasto', (request, reply) => {
    
    connection.query("select pc.idpc,pc.HW_idHW,pc.Seriale,pc.n_inventario,pc.n_fattura,pc.data_Acquisto,pc.note,pc.SEDE_idSEDE,pc.STATO_idSTATO,stato.ritiro,stato.consegna,stato.guasto,stato.riparazione,stato.ko,hw.cpu,hw.ram,hw.Memoria,hw.Tipo_memoria,hw.marca,hw.modello from pc inner join stato on pc.stato_idStato=stato.IdStato inner join hw on pc.HW_idHW=hw.IDhw where sede_idsede=? and  STATO_idSTATO=4",[request.params.id],(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results)


    });
});
app.get('/api/sede/:id/pc_stato/riparazione', (request, reply) => {
    
    connection.query("select pc.idpc,pc.HW_idHW,pc.Seriale,pc.n_inventario,pc.n_fattura,pc.data_Acquisto,pc.note,pc.SEDE_idSEDE,pc.STATO_idSTATO,stato.ritiro,stato.consegna,stato.guasto,stato.riparazione,stato.ko,hw.cpu,hw.ram,hw.Memoria,hw.Tipo_memoria,hw.marca,hw.modello from pc inner join stato on pc.stato_idStato=stato.IdStato inner join hw on pc.HW_idHW=hw.IDhw where sede_idsede=? and  STATO_idSTATO=5",[request.params.id],(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results)


    });
});
app.get('/api/sede/:id/pc_stato/ko', (request, reply) => {
    
    connection.query("select pc.idpc,pc.HW_idHW,pc.Seriale,pc.n_inventario,pc.n_fattura,pc.data_Acquisto,pc.note,pc.SEDE_idSEDE,pc.STATO_idSTATO,stato.ritiro,stato.consegna,stato.guasto,stato.riparazione,stato.ko,hw.cpu,hw.ram,hw.Memoria,hw.Tipo_memoria,hw.marca,hw.modello from pc inner join stato on pc.stato_idStato=stato.IdStato inner join hw on pc.HW_idHW=hw.IDhw where sede_idsede=? and  STATO_idSTATO=6",[request.params.id],(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results)


    });
});
app.get('/api/sede/:id/pc_stato/nuovo', (request, reply) => {
    
    connection.query("select pc.idpc,pc.HW_idHW,pc.Seriale,pc.n_inventario,pc.n_fattura,pc.data_Acquisto,pc.note,pc.SEDE_idSEDE,pc.STATO_idSTATO,stato.ritiro,stato.consegna,stato.guasto,stato.riparazione,stato.ko,hw.cpu,hw.ram,hw.Memoria,hw.Tipo_memoria,hw.marca,hw.modello from pc inner join stato on pc.stato_idStato=stato.IdStato inner join hw on pc.HW_idHW=hw.IDhw where sede_idsede=? and  STATO_idSTATO=1",[request.params.id],(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results)


    });
});

app.post('/api/sede/pc', (request, reply) => {
    let pc=request.body;
    let date = new Date(pc.data_Acquisto);
    connection.query("insert into pc (HW_idHW,Seriale,n_inventario,n_fattura,data_Acquisto,note,SEDE_idSEDE,STATO_idSTATO) values(?,?,?,?,?,?,?,?)", 
    [pc.HW_idHW,pc.Seriale,pc.n_inventario,pc.n_fattura,date,pc.note,pc.SEDE_idSEDE,pc.STATO_idSTATO], (error, results, fields)=>{      
        if(error){
            reply.status(500).send({error: error.message});
            return;
        }
        reply.status(201).send();
    });
});

app.get('/api/sede/pc/:id',(request,reply)=>{
    connection.query("select pc.idpc,pc.HW_idHW,pc.Seriale,pc.n_inventario,pc.n_fattura,pc.data_Acquisto,pc.note,pc.SEDE_idSEDE,pc.STATO_idSTATO,stato.ritiro,stato.consegna,stato.guasto,stato.riparazione,stato.ko,hw.cpu,hw.ram,hw.Memoria,hw.Tipo_memoria,hw.marca,hw.modello from pc inner join stato on pc.stato_idStato=stato.IdStato inner join hw on pc.HW_idHW=hw.IDhw  where pc.idpc=?",[request.params.id],(error,results,fields)=>{
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        if(results.length == 0)
            reply.status(404).send();
        else
            reply.send(results[0]);
    });
});

//------movimenti----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.post('/api/sede/movimenti', (request, reply) => {
    connection.query("INSERT INTO MOVIMENTO (data_consegna,cavo_rete,alimentatore,borsa,mouse,hdd,con_ethernet,con_usb,note,note_movimento,PC_idPC,UTENTE_idUTENTE,ADMIN_idADMIN) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",[request.body.data_consegna,request.body.cavo_rete,request.body.alimentatore,request.body.borsa,request.body.mouse,request.body.hdd,request.body.con_ethernet,request.body.con_usb,request.body.note,request.body.note_movimento,request.body.PC_idpc,request.body.UTENTE_idUTENTE,request.body.ADMIN_idADMIN], (error, results, fields)=>{      
        if(error){
            reply.status(500).send({error: error.message});
            return;
        }
        reply.status(201).send();
    });
});

app.get('/api/sede/:id/movimento', (request, reply) => {
    connection.query("select m.idMOVIMENTO, m.data_consegna,m.cavo_rete,m.alimentatore,m.borsa,m.mouse,m.hdd,m.con_ethernet,m.con_usb,m.note,m.note_movimento,,m.PC_idpc,m.ADMIN_idADMIN,u.nome,u.cognome,c.corso,pc.Seriale from movimento as m inner join  utente as u on m.UTENTE_idUTENTE=u.idUTENTE inner join pc on m.PC_idpc=pc.idpc inner join stato on pc.STATO_idSTATO=stato.idSTATO inner join corso as c on u.CORSO_idCORSO=c.idCORSO where u.SEDE_idSEDE=? " ,[request.params.id],(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results);

    });
});
app.get('/api/sede/:idsede/movimento/consegne', (request, reply) => {
    connection.query("select m.idMOVIMENTO,m.data_consegna,m.cavo_rete,m.alimentatore,m.borsa,m.mouse,m.hdd,m.con_ethernet,m.con_usb,m.note,m.note_movimento,m.PC_idpc,m.ADMIN_idADMIN,u.nome,u.cognome,c.corso,pc.Seriale from movimento as m inner join  utente as u on m.UTENTE_idUTENTE=u.idUTENTE inner join pc on m.PC_idpc=pc.idpc inner join stato on pc.STATO_idSTATO=stato.idSTATO inner join corso as c on u.CORSO_idCORSO=c.idCORSO where  m.STATO_idSTATO=3 && pc.SEDE_idSEDE=?",[request.params.idsede] ,(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results);

    });
});
app.get('/api/sede/:idsedi/movimento/ritiri', (request, reply) => {
    connection.query("select m.idMOVIMENTO,m.data_consegna,m.cavo_rete,m.alimentatore,m.borsa,m.mouse,m.hdd,m.con_ethernet,m.con_usb,m.note,m.note_movimento,m.PC_idpc,m.ADMIN_idADMIN,u.nome,u.cognome,c.corso,pc.Seriale from movimento as m inner join  utente as u on m.UTENTE_idUTENTE=u.idUTENTE inner join pc on m.PC_idpc=pc.idpc inner join stato on pc.STATO_idSTATO=stato.idSTATO inner join corso as c on u.CORSO_idCORSO=c.idCORSO where  m.STATO_idSTATO=2 && c.SEDE_idSEDE=?",[request.params.idsedi] ,(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results);

    });
});  
app.get('/api/sede/:idsedia/movimento/guasti', (request, reply) => {
    connection.query("select m.idMOVIMENTO,m.data_consegna,m.cavo_rete,m.alimentatore,m.borsa,m.mouse,m.hdd,m.con_ethernet,m.con_usb,m.note,m.note_movimento,m.PC_idpc,m.ADMIN_idADMIN,u.nome,u.cognome,c.corso,pc.Seriale from movimento as m inner join  utente as u on m.UTENTE_idUTENTE=u.idUTENTE inner join pc on m.PC_idpc=pc.idpc inner join stato on pc.STATO_idSTATO=stato.idSTATO inner join corso as c on u.CORSO_idCORSO=c.idCORSO where  m.STATO_idSTATO=4 && pc.SEDE_idSEDE=?",[request.params.idsedia] ,(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results);

    });
}); 
// insert movimenti
app.post('/api/sede/new_movimenti', (request, reply) => {
    let m=request.body;
    let date = new Date(m.data_consegna);
    connection.query("INSERT INTO MOVIMENTO (data_consegna,cavo_rete,alimentatore,borsa,mouse,hdd,con_ethernet,con_usb,note,note_movimento,PC_idPC,UTENTE_idUTENTE,ADMIN_idADMIN,STATO_idSTATO) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[date,m.cavo_rete,m.alimentatore,m.borsa,m.mouse,m.hdd,m.con_ethernet,m.con_usb,m.note,m.note_movimento,m.PC_idpc,m.UTENTE_idUTENTE,m.ADMIN_idADMIN,m.STATO_idSTATO], (error, results, fields)=>{      
        if(error){
            reply.status(500).send({error: error.message});
            return;
        }
        reply.status(201).send();
    });
});
app.put('/api/sede/pc/updata/:id', (request, reply) => {
    let pc = request.body;
    connection.query("UPDATE pc SET STATO_idSTATO=? where Idpc=?", [pc.STATO_idSTATO, request.params.id],
        (error, results, fields) => {
            if (error) {
                reply.status(500).send({ error: error.message });
                return;
            }
            reply.status(204).send(results);
        });
});
//  manutentore
app.get('/api/sede/:id/manutentore', (request, reply) => {
    connection.query("select * from manutentore where sede_idsede=? ", [request.params.id], (error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results)


    });
});
app.get('/api/sede/manutentore/:id', (request, reply) => {
    connection.query("select nome,cognome,via,civico,comune,provincia_sigla,ditta from manutentore  where idMANUTENTORE=? ", [request.params.id], (error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        if(results.length == 0)
            reply.status(404).send();
        else
            reply.send(results[0]);


    });
});
app.post('/api/manutentore', (request, reply) => {
    let m = request.body;
    connection.query('Insert into manutentore (nome,cognome,via,civico,comune,provincia_sigla,ditta,SEDE_idSEDE) Values(?,?,?,?,?,?,?,?)',
        [m.nome, m.cognome, m.via, m.civico, m.comune, m.provincia_sigla, m.ditta, m.SEDE_idSEDE],
        (error, results, fields) => {
            if (error) {
                reply.status(500).send({ error: error.message });
                return;
            }
            reply.status(201).send(results);
        });
});
app.get('/api/sede/:id/movimentimanu', (request, reply) => {
    connection.query('select m.idMOVIMENTO_MANUTENTORE, m.data_consegna,m.note,m.note_movimento,m.N_Fattura_Riparazione,m.STATO_idSTATO,m.PC_idpc,m.ADMIN_idADMIN,m.MANUTENTORE_idMANUTENTORE,manu.nome,manu.cognome from movimentimanutentore as m inner join manutentore as manu on m.MANUTENTORE_idMANUTENTORE=manu.idMANUTENTORE  where manu.SEDE_idSEDE=?', [request.params.id], (error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results)
    });
});
app.get('/api/sede/:idsede/movimentimanu/consegne', (request, reply) => {
    connection.query("select m.idMOVIMENTO_MANUTENTORE, m.data_consegna,m.note,m.note_movimento,m.N_Fattura_Riparazione,m.STATO_idSTATO,m.PC_idpc,m.ADMIN_idADMIN,m.MANUTENTORE_idMANUTENTORE,manu.nome,manu.cognome from movimentimanutentore as m inner join manutentore as manu on m.MANUTENTORE_idMANUTENTORE=manu.idMANUTENTORE  where m.STATO_idSTATO=5 && manu.SEDE_idSEDE=?",[request.params.idsede] ,(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results);

    });
});
app.get('/api/sede/:idsedi/movimentimanu/ritiri', (request, reply) => {
    connection.query("select m.idMOVIMENTO_MANUTENTORE, m.data_consegna,m.note,m.note_movimento,m.N_Fattura_Riparazione,m.STATO_idSTATO,m.PC_idpc,m.ADMIN_idADMIN,m.MANUTENTORE_idMANUTENTORE,manu.nome,manu.cognome from movimentimanutentore as m inner join manutentore as manu on m.MANUTENTORE_idMANUTENTORE=manu.idMANUTENTORE  where m.STATO_idSTATO=2 && manu.SEDE_idSEDE=?",[request.params.idsedi] ,(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results);

    });
});  
app.get('/api/sede/:idsedia/movimentimanu/ko', (request, reply) => {
    connection.query("select m.idMOVIMENTO_MANUTENTORE, m.data_consegna,m.note,m.note_movimento,m.N_Fattura_Riparazione,m.STATO_idSTATO,m.PC_idpc,m.ADMIN_idADMIN,m.MANUTENTORE_idMANUTENTORE,manu.nome,manu.cognome from movimentimanutentore as m inner join manutentore as manu on m.MANUTENTORE_idMANUTENTORE=manu.idMANUTENTORE  where m.STATO_idSTATO=6 && manu.SEDE_idSEDE=?",[request.params.idsedia] ,(error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.send(results);

    });
}); 
app.get('/api/sede/movimentimanu/:id', (request, reply) => {
    connection.query('select m.data_consegna,m.note,m.note_movimento,m.N_Fattura_Riparazione,m.STATO_idSTATO,m.PC_idpc,m.ADMIN_idADMIN,m.MANUTENTORE_idMANUTENTORE,manu.nome,manu.cognome from movimentimanutentore as m inner join manutentore as manu on m.MANUTENTORE_idMANUTENTORE=manu.idMANUTENTORE  where m.idMOVIMENTO_MANUTENTORE=?', [request.params.id], (error, results, fields) => {
        app.log.info(results);
        app.log.info(fields);
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        if(results.length == 0)
            reply.status(404).send();
        else
            reply.send(results[0]);
    });
});
app.post('/api/sede/movimentimanu', (request, reply) => {
    let movimenti=request.body;
    connection.query("INSERT INTO MOVIMENTIMANUTENTORE (data_consegna,note,note_movimento,N_Fattura_Riparazione,PC_idPC,ADMIN_idADMIN,STATO_idSTATO,MANUTENTORE_idMANUTENTORE) VALUES(?,?,?,?,?,?,?,?)", [movimenti.data_consegna, movimenti.note, movimenti.note_movimento,movimenti.N_Fattura_Riparazione, movimenti.PC_idpc,  movimenti.ADMIN_idADMIN,movimenti.STATO_idSTATO,movimenti.MANUTENTORE_idMANUTENTORE], (error, results, fields) => {
        if (error) {
            reply.status(500).send({ error: error.message });
            return;
        }
        reply.status(201).send();
    });
});

app.listen(3000, (err, address) => {
    if (err) throw err
    app.log.info(`server listening on ${address}`)
});