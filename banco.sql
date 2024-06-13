CREATE DATABASE db_lava_rapido;

USE db_lava_rapido;

drop database db_lava_rapido;

drop procedure inserir_cliente_com_endereco;

/*************************
Tabela Clientes
*************************/
CREATE TABLE tbl_clientes (
    id_cliente INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    foto VARCHAR(250),
    email VARCHAR(150),
    senha VARCHAR(100),
    telefone VARCHAR(18),
    id_endereco_cliente INT NOT NULL,
    CONSTRAINT FK_ENDERECO_CLIENTE FOREIGN KEY (id_endereco_cliente)
        REFERENCES tbl_enderecos_clientes(id_endereco_cliente)
);

alter table tbl_enderecos_clientes
	drop column complemento;

select * from tbl_clientes;

INSERT INTO tbl_clientes(nome, foto, email, senha, telefone, id_endereco)VALUES
('Gustavo',
'https://www.nube.com.br/media/noticias/2008/06/17/1049/perfil-profissional-sucesso-carreira-caracteristicas_400x600.jpg',
'gustavo@gmail.com',
'gustavo123',
'11986353648',
1);

select * from tbl_enderecos;

 DELIMITER //

CREATE PROCEDURE inserir_cliente_com_endereco (
    IN p_nome VARCHAR(100),
    IN p_email VARCHAR(150),
    IN p_senha VARCHAR(100),
    IN p_telefone VARCHAR(18),
    IN p_rua VARCHAR(45),
    IN p_cep FLOAT,
    IN p_numero FLOAT,
    IN p_bairro VARCHAR(150),
    IN p_estado VARCHAR(80),
    IN p_cidade VARCHAR(80)
)
BEGIN
    DECLARE v_id_endereco_cliente INT;

    -- Inserir o endereço
    INSERT INTO tbl_enderecos_clientes (rua, cep, numero, bairro, estado, cidade)
    VALUES (p_rua, p_cep, p_numero, p_bairro, p_estado, p_cidade);

    -- Obter o ID do endereço inserido
    SET v_id_endereco_cliente = LAST_INSERT_ID();

    -- Inserir o cliente
    INSERT INTO tbl_clientes (nome, email, senha, telefone, id_endereco_cliente)
    VALUES (p_nome, p_email, p_senha, p_telefone, v_id_endereco_cliente);
END//

DELIMITER ;


CALL inserir_cliente_com_endereco('Julia', 'julia@gmail', '1234', '11980807794', 'rua sao mateus', '06332020',
'260', 'vila ester', 'sao paulo', 'carapicuiba');

select * from tbl_enderecos_clientes;

drop trigger tgrDeletarCliente;

DELIMITER //

CREATE TRIGGER tgrDeletarCliente
BEFORE DELETE ON tbl_clientes
FOR EACH ROW
BEGIN
    -- Deletar os registros das tabelas relacionadas ao cliente
    DELETE FROM tbl_clientes_veiculos WHERE id_cliente = OLD.id_cliente;
   
    DELETE af
    FROM tbl_agendamentos_funcionarios af
    JOIN tbl_agendamentos ag ON af.id_agendamento = ag.id_agendamento
    JOIN tbl_clientes_veiculos cv ON ag.id_cliente_veiculo = cv.id_cliente_veiculo
    WHERE cv.id_cliente = OLD.id_cliente;

    DELETE sa
    FROM tbl_servicos_agendamentos sa
    JOIN tbl_agendamentos ag ON sa.id_agendamento = ag.id_agendamento
    JOIN tbl_clientes_veiculos cv ON ag.id_cliente_veiculo = cv.id_cliente_veiculo
    WHERE cv.id_cliente = OLD.id_cliente;

    DELETE p
    FROM tbl_pagamentos p
    JOIN tbl_servicos_agendamentos sa ON p.id_servico_agendamento = sa.id_servico_agendamento
    JOIN tbl_agendamentos ag ON sa.id_agendamento = ag.id_agendamento
    JOIN tbl_clientes_veiculos cv ON ag.id_cliente_veiculo = cv.id_cliente_veiculo
    WHERE cv.id_cliente = OLD.id_cliente;

    DELETE rec
    FROM tbl_recibos rec
    JOIN tbl_pagamentos p ON rec.id_pagamento = p.id_pagamento
    JOIN tbl_servicos_agendamentos sa ON p.id_servico_agendamento = sa.id_servico_agendamento
    JOIN tbl_agendamentos ag ON sa.id_agendamento = ag.id_agendamento
    JOIN tbl_clientes_veiculos cv ON ag.id_cliente_veiculo = cv.id_cliente_veiculo
    WHERE cv.id_cliente = OLD.id_cliente;

    DELETE ag
    FROM tbl_agendamentos ag
    JOIN tbl_clientes_veiculos cv ON ag.id_cliente_veiculo = cv.id_cliente_veiculo
    WHERE cv.id_cliente = OLD.id_cliente;
   
    -- Se necessário, pode-se adicionar mais comandos para outras tabelas relacionadas
END//

DELIMITER ;

select * from tbl_clientes_veiculos;

delete from tbl_clientes where tbl_clientes.id_cliente = 4;

SET SQL_SAFE_UPDATES = 0;

show triggers;


-- Consultar todas as informações de endereço do cliente
SELECT
    tbl_enderecos.rua,
    tbl_enderecos.cep,
    tbl_enderecos.numero,
    tbl_enderecos.complemento,
    tbl_enderecos.bairro,
    tbl_enderecos.estado,
    tbl_enderecos.cidade
FROM tbl_clientes JOIN tbl_enderecos ON tbl_clientes.id_endereco = tbl_enderecos.id_endereco WHERE tbl_clientes.nome = 'Gustavo';

select * from tbl_clientes where tbl_clientes.id_cliente = 1;

/*************************
Tabela Funcionarios
*************************/
CREATE TABLE tbl_funcionarios (
    id_funcionario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(150),
    senha VARCHAR(100),
    cargo VARCHAR(30),
    telefone VARCHAR(18),
        id_endereco_funcionario INT NOT NULL,
    CONSTRAINT FK_ENDERECO_FUNCIONARIO FOREIGN KEY (id_endereco_funcionario)
        REFERENCES tbl_enderecos_funcionarios(id_endereco_funcionario)
);

INSERT INTO tbl_funcionarios(nome, email, senha, cargo, telefone, id_endereco)VALUES
('Murilo',
'murilo@gmail.com',
'murilo123',
'Funcionário',
'11637864582',
2);

drop table tbl_funcionarios;



select * from tbl_funcionarios;

/*************************
Tabela Datas
*************************/
CREATE TABLE tbl_datas(
id_data INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
datas date not null
);

INSERT INTO tbl_datas(datas)VALUES
('2024-02-10');

/*************************
Tabela Horas
*************************/
CREATE TABLE tbl_horas (
    id_horario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    horas TIME NOT NULL
);

INSERT INTO tbl_horas(horas)VALUES
('18:00:00');

drop procedure inserir_hora_data;



DELIMITER //

CREATE PROCEDURE inserir_hora_data (
    IN p_hora TIME
)
BEGIN
    DECLARE v_id_horario INT;
    DECLARE v_id_data INT;

    -- Inserir a hora
    INSERT INTO tbl_horas (horas)
    VALUES (p_hora);

    -- Obter o ID da hora inserida
    SET v_id_horario = LAST_INSERT_ID();

    -- Obter o último ID da data inserida
    SELECT id_data INTO v_id_data FROM tbl_datas ORDER BY id_data DESC LIMIT 1;

    -- Inserir a hora e data na tabela intermediária
    INSERT INTO tbl_datas_horarios (id_data, id_horario)
    VALUES (v_id_data, v_id_horario);
END//

DELIMITER ;

CALL inserir_hora_data('18:30:00');

select * from tbl_datas_horarios;

delete from tbl_datas where id_data = 2;

DELIMITER //

CREATE TRIGGER tgrDeletarData
BEFORE DELETE ON tbl_datas
FOR EACH ROW
BEGIN
 DELETE FROM tbl_datas_horarios WHERE id_data = OLD.id_data;
    -- Se necessário, pode-se adicionar mais comandos para outras tabelas relacionadas
END//

DELIMITER ;

/*************************
Tabela Endereços
*************************/
CREATE TABLE tbl_enderecos_clientes (
    id_endereco_cliente INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    rua VARCHAR(45),
    cep FLOAT,
    numero FLOAT,
    complemento VARCHAR(100),
    bairro VARCHAR(150),
    estado VARCHAR(80),
    cidade VARCHAR(80)
);

INSERT INTO tbl_enderecos(rua, cep, numero, complemento, bairro, estado, cidade)VALUES
('Rua Belval',
'64782358',
'39',
'Do lado do mercado do Zé',
'Vila Barros',
'São Paulo',
'Carapicuíba');

select * from tbl_enderecos;

select * from tbl_veiculos where tbl_enderecos_clientes.id_endereco_cliente = 1;

drop table tbl_clientes;
drop table tbl_cliente_funcionarios;
/*************************
Tabela Endereços Funcionarios
*************************/
CREATE TABLE tbl_enderecos_funcionarios(
    id_endereco_funcionario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    rua VARCHAR(45),
    cep FLOAT,
    numero FLOAT,
    complemento VARCHAR(100),
    bairro VARCHAR(150),
    estado VARCHAR(80),
    cidade VARCHAR(80)
);


/*************************
Tabela Serviços
*************************/
CREATE TABLE tbl_servicos (
    id_servico INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tipo_servico VARCHAR(50),
    descricao TEXT,
    preco DOUBLE
);

INSERT INTO tbl_servicos(tipo_servico, descricao, preco)VALUES
('Lavagem Completa',
'Lavagem por fora e por dentro do veículo',
'250');

update tbl_servicos SET
            tipo_servico = '${dadosAtualizados.tipo_servico}',
            descricao = '${dadosAtualizados.descricao}',
            preco = 100
            WHERE
           tbl_servicos.id_servico = 2;

select * from tbl_servicos;

delete from tbl_servicos where id_servico = 1;

/*************************
Tabela Forma de Pagamentos
*************************/
CREATE TABLE tbl_formas_pagamentos (
    id_forma_pagamento INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    forma_pagamento VARCHAR(20)
);

INSERT INTO tbl_formas_pagamentos(forma_pagamento)VALUES
('Crédito');

select * from tbl_formas_pagamentos;

/*************************
Tabela Pagamentos
*************************/
CREATE TABLE tbl_pagamentos (
    id_pagamento INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    valor_pago FLOAT,
    data_pagamento DATE,
    horario_pagamento TIME,
    id_servico_agendamento INT NOT NULL,
    id_forma_pagamento INT NOT NULL,
    CONSTRAINT FK_FORMA_PAGAMENTO_PAGAMENTO FOREIGN KEY (id_forma_pagamento)
        REFERENCES tbl_formas_pagamentos (id_forma_pagamento),
    CONSTRAINT FK_SERVICO_AGENDAMENTO_PAGAMENTO FOREIGN KEY (id_servico_agendamento)
        REFERENCES tbl_servicos_agendamentos (id_servico_agendamento)
);

INSERT INTO tbl_pagamentos(valor_pago, data_pagamento, horario_pagamento, id_servico_agendamento, id_forma_pagamento)VALUES
('100',
'2024-02-10',
'17:40:00',
1,
1);

select * from tbl_pagamentos;

/*************************
Tabela Recibos
*************************/
CREATE TABLE tbl_recibos (
    id_recibo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    data_emissao DATE,
    id_pagamento INT NOT NULL,
    CONSTRAINT FK_RECIBO_PAGAMENTO FOREIGN KEY (id_pagamento)
        REFERENCES tbl_pagamentos (id_pagamento)
);

INSERT INTO tbl_recibos(data_emissao, id_pagamento)VALUES
('2024-02-10',
1);


-- Consultar dados de pagamento e data de emissão dos recibos pelo nome do cliente
SELECT
    tbl_clientes.nome AS nome_cliente,
    tbl_pagamentos.valor_pago,
    tbl_pagamentos.data_pagamento,
    tbl_pagamentos.horario_pagamento,
    tbl_formas_pagamentos.forma_pagamento,
    tbl_recibos.data_emissao
FROM
    tbl_clientes
JOIN
    tbl_clientes_veiculos ON tbl_clientes.id_cliente = tbl_clientes_veiculos.id_cliente
JOIN
    tbl_agendamentos ON tbl_clientes_veiculos.id_cliente_veiculo = tbl_agendamentos.id_cliente_veiculo
JOIN
    tbl_servicos_agendamentos ON tbl_agendamentos.id_agendamento = tbl_servicos_agendamentos.id_agendamento
LEFT JOIN
    tbl_pagamentos ON tbl_servicos_agendamentos.id_servico_agendamento = tbl_pagamentos.id_servico_agendamento
LEFT JOIN
    tbl_formas_pagamentos ON tbl_pagamentos.id_forma_pagamento = tbl_formas_pagamentos.id_forma_pagamento
LEFT JOIN
    tbl_recibos ON tbl_pagamentos.id_pagamento = tbl_recibos.id_pagamento
WHERE
    tbl_clientes.nome = 'Vinicius';



/*************************
Tabela Veiculos
*************************/
CREATE TABLE tbl_veiculos (
    id_veiculo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(30),
    marca VARCHAR(80),
    ano YEAR,
    placa VARCHAR(10),
    cor VARCHAR(50)
);

INSERT INTO tbl_veiculos(modelo, marca, ano, placa, cor)VALUES
('X7',
'BMW',
'2019',
'ZYAR-523',
'Branco');

select * from tbl_veiculos;

delete from tbl_veiculos where tbl_veiculos.id_veiculo = 3;

/*******************************
Tabela Clientes Veiculos
*******************************/
CREATE TABLE tbl_clientes_veiculos (
    id_cliente_veiculo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_veiculo INT NOT NULL,
    CONSTRAINT FK_CLIENTE_VEICULO FOREIGN KEY (id_cliente)
        REFERENCES tbl_clientes (id_cliente),
    CONSTRAINT FK_VEICULO_CLIENTE FOREIGN KEY (id_veiculo)
        REFERENCES tbl_veiculos (id_veiculo)
);

drop procedure inserir_veiculo_cliente;

DELIMITER //

CREATE PROCEDURE inserir_veiculo_cliente (
    IN p_modelo VARCHAR(30),
    IN p_marca VARCHAR(80),
    IN p_ano YEAR,
    IN p_placa VARCHAR(10),
    IN p_cor VARCHAR(50)
)
BEGIN
    DECLARE v_id_veiculo INT;

    -- Inserir o veículo
    INSERT INTO tbl_veiculos (modelo, marca, ano, placa, cor)
    VALUES (p_modelo, p_marca, p_ano, p_placa, p_cor);

    -- Obter o ID do veículo inserido
    SET v_id_veiculo = LAST_INSERT_ID();

    -- Inserir o cliente e veículo na tabela intermediária
    INSERT INTO tbl_clientes_veiculos (id_cliente, id_veiculo)
    VALUES (LAST_INSERT_ID(), v_id_veiculo);
END//

DELIMITER ;

CALL inserir_veiculo_cliente('X6', 'BMW', '2024', 'XFDE-237', 'Azul');

show triggers;

SELECT
    datas.datas,
    horas.horas,
    clientes.nome AS nome_cliente,
    clientes.email AS email_cliente,
    clientes.telefone AS telefone_cliente,
    veiculos.modelo AS modelo_veiculo,
    veiculos.marca AS marca_veiculo,
    veiculos.ano AS ano_veiculo,
    veiculos.placa AS placa_veiculo,
    veiculos.cor AS cor_veiculo,
    servicos.tipo_servico AS tipo_servico,
    servicos.descricao AS descricao_servico,
    servicos.preco AS preco_servico,
    servicos_agendamentos.detalhes_adicionais -- Adicione aqui o campo específico de detalhes adicionais da tbl_servicos_agendamentos
FROM
    tbl_agendamentos AS agendamentos
JOIN
    tbl_datas_horarios AS datas_horarios ON agendamentos.id_data_horario = datas_horarios.id_data_horario
JOIN
    tbl_datas AS datas ON datas_horarios.id_data = datas.id_data
JOIN
    tbl_horas AS horas ON datas_horarios.id_horario = horas.id_horario
JOIN
    tbl_clientes_veiculos AS clientes_veiculos ON agendamentos.id_cliente_veiculo = clientes_veiculos.id_cliente_veiculo
JOIN
    tbl_clientes AS clientes ON clientes_veiculos.id_cliente = clientes.id_cliente
JOIN
    tbl_veiculos AS veiculos ON clientes_veiculos.id_veiculo = veiculos.id_veiculo
JOIN
    tbl_servicos_agendamentos AS servicos_agendamentos ON agendamentos.id_agendamento = servicos_agendamentos.id_agendamento
JOIN
    tbl_servicos AS servicos ON servicos_agendamentos.id_servico = servicos.id_servico
WHERE
    clientes.id_cliente = 2;






INSERT INTO tbl_clientes_veiculos(id_cliente, id_veiculo)VALUES
(2,2);

select * from tbl_clientes_veiculos;

create view vw_info_veiculo_cliente as

SELECT
    v.modelo,
    v.marca,
    v.ano,
    v.placa,
    v.cor
FROM
    tbl_clientes c
JOIN
    tbl_clientes_veiculos cv ON c.id_cliente = cv.id_cliente
JOIN
    tbl_veiculos v ON cv.id_veiculo = v.id_veiculo
WHERE
    c.id_cliente = 3;
   
    select * from vw_info_veiculo_cliente;

-- Consultar todas as informações do veículo do cliente com email
SELECT
tbl_clientes.email,
    tbl_clientes.telefone,
    tbl_veiculos.modelo,
    tbl_veiculos.marca,
    tbl_veiculos.ano,
    tbl_veiculos.placa,
    tbl_veiculos.cor
FROM
    tbl_clientes
JOIN
    tbl_clientes_veiculos ON tbl_clientes.id_cliente = tbl_clientes_veiculos.id_cliente
JOIN
    tbl_veiculos ON tbl_clientes_veiculos.id_veiculo = tbl_veiculos.id_veiculo
WHERE
    tbl_clientes.email = 'gustavo@gmail.com';


/*************************
Tabela Datas Horas
*************************/
CREATE TABLE tbl_datas_horarios (
    id_data_horario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_horario INT NOT NULL,
    id_data INT NOT NULL,
    CONSTRAINT FK_HORARIO_DATA FOREIGN KEY (id_horario)
        REFERENCES tbl_horas (id_horario),
    CONSTRAINT FK_DATA_HORARIO FOREIGN KEY (id_data)
        REFERENCES tbl_datas (id_data)
);

INSERT INTO tbl_datas_horarios(id_horario, id_data)VALUES
(2,1);

/*************************
Tabela Agendamentos
*************************/
CREATE TABLE tbl_agendamentos (
    id_agendamento INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_data_horario INT NOT NULL,
    id_cliente_veiculo INT NOT NULL,
    CONSTRAINT FK_DATA_HORARIO_AGENDAMENTO FOREIGN KEY (id_data_horario)
        REFERENCES tbl_datas_horarios (id_data_horario),
    CONSTRAINT FK_CLIENTE_VEICULO_AGENDAMENTO FOREIGN KEY (id_cliente_veiculo)
        REFERENCES tbl_clientes_veiculos (id_cliente_veiculo)
);

DELIMITER //

CREATE TRIGGER trg_auto_insert_agendamento
AFTER INSERT ON tbl_datas_horarios
FOR EACH ROW
BEGIN
    DECLARE last_cliente_veiculo_id INT;

    -- Obtém o último ID inserido na tbl_clientes_veiculos
    SELECT MAX(id_cliente_veiculo) INTO last_cliente_veiculo_id FROM tbl_clientes_veiculos;

    -- Insere um novo registro na tabela tbl_agendamentos
    INSERT INTO tbl_agendamentos (id_data_horario, id_cliente_veiculo)
    VALUES (NEW.id_data_horario, last_cliente_veiculo_id);
END;
//

DELIMITER ;

INSERT INTO tbl_agendamentos(id_data_horario, id_cliente_veiculo)VALUES
(2,2);

show triggers;

-- filtra todos os agendamentos de uma data especifica
SELECT
    tbl_clientes.nome,
    tbl_clientes.email,
    tbl_clientes.telefone,
    tbl_veiculos.modelo,
    tbl_veiculos.marca,
    tbl_veiculos.ano,
    tbl_veiculos.placa,
    tbl_veiculos.cor,
    tbl_datas.datas,
    tbl_horas.horas
FROM
    tbl_clientes
JOIN
    tbl_clientes_veiculos ON tbl_clientes.id_cliente = tbl_clientes_veiculos.id_cliente
JOIN
    tbl_veiculos ON tbl_clientes_veiculos.id_veiculo = tbl_veiculos.id_veiculo
JOIN
    tbl_agendamentos ON tbl_clientes.id_cliente = tbl_agendamentos.id_cliente_veiculo
JOIN
    tbl_datas_horarios ON tbl_agendamentos.id_data_horario = tbl_datas_horarios.id_data_horario
JOIN
    tbl_datas ON tbl_datas_horarios.id_data = tbl_datas.id_data
JOIN
    tbl_horas ON tbl_datas_horarios.id_horario = tbl_horas.id_horario
WHERE
    tbl_datas.datas = '2024-02-10';


/****************************************
Tabela Agendamentos Funcionarios
****************************************/
CREATE TABLE tbl_agendamentos_funcionarios (
    id_agendamento_funcionario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_agendamento INT NOT NULL,
    id_funcionario INT NOT NULL,
    CONSTRAINT FK_AGENDAMENTO_FUNCIONARIO FOREIGN KEY (id_agendamento)
        REFERENCES tbl_agendamentos (id_agendamento),
    CONSTRAINT FK_FUNCIONARIO_AGENDAMENTO FOREIGN KEY (id_funcionario)
        REFERENCES tbl_funcionarios (id_funcionario)
);

INSERT INTO tbl_agendamentos_funcionarios(id_agendamento, id_funcionario)VALUES
(2,1);

-- Consultar agendamentos associados a um funcionário pelo nome do funcionário
SELECT
    tbl_funcionarios.nome AS nome_funcionario,
    tbl_clientes.nome AS nome_cliente,
    tbl_clientes.email AS email_cliente,
    tbl_clientes.telefone AS telefone_cliente,
    tbl_veiculos.modelo,
    tbl_veiculos.marca,
    tbl_veiculos.ano,
    tbl_veiculos.placa,
    tbl_veiculos.cor,
    tbl_servicos.tipo_servico,
    tbl_servicos.descricao,
    tbl_datas.datas,
    tbl_horas.horas,
    tbl_recibos.data_emissao -- Incluir a data de emissão dos recibos
FROM
    tbl_funcionarios
JOIN
    tbl_agendamentos_funcionarios ON tbl_funcionarios.id_funcionario = tbl_agendamentos_funcionarios.id_funcionario
JOIN
    tbl_agendamentos ON tbl_agendamentos_funcionarios.id_agendamento = tbl_agendamentos.id_agendamento
JOIN
    tbl_datas_horarios ON tbl_agendamentos.id_data_horario = tbl_datas_horarios.id_data_horario
JOIN
    tbl_datas ON tbl_datas_horarios.id_data = tbl_datas.id_data
JOIN
    tbl_horas ON tbl_datas_horarios.id_horario = tbl_horas.id_horario
JOIN
    tbl_clientes_veiculos ON tbl_agendamentos.id_cliente_veiculo = tbl_clientes_veiculos.id_cliente_veiculo
JOIN
    tbl_clientes ON tbl_clientes_veiculos.id_cliente = tbl_clientes.id_cliente
JOIN
    tbl_veiculos ON tbl_clientes_veiculos.id_veiculo = tbl_veiculos.id_veiculo
JOIN
    tbl_servicos_agendamentos ON tbl_agendamentos.id_agendamento = tbl_servicos_agendamentos.id_agendamento
JOIN
    tbl_servicos ON tbl_servicos_agendamentos.id_servico = tbl_servicos.id_servico
LEFT JOIN
    tbl_pagamentos ON tbl_servicos_agendamentos.id_servico_agendamento = tbl_pagamentos.id_servico_agendamento
LEFT JOIN
    tbl_recibos ON tbl_pagamentos.id_pagamento = tbl_recibos.id_pagamento
WHERE
    tbl_funcionarios.nome = 'Murilo';



/****************************************
Tabela Serviços Agendados
****************************************/
CREATE TABLE tbl_servicos_agendamentos (
    id_servico_agendamento INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    detalhes_adicionais TEXT,
    id_agendamento INT NOT NULL,
    id_servico INT NOT NULL,
    CONSTRAINT FK_AGENDAMENTO_SERVICO FOREIGN KEY (id_agendamento)
        REFERENCES tbl_agendamentos (id_agendamento),
    CONSTRAINT FK_SERVICO_AGENDAMENTO FOREIGN KEY (id_servico)
        REFERENCES tbl_servicos (id_servico)
);


DELIMITER //

CREATE PROCEDURE inserir_servico_agendamento (
    IN p_detalhes_adicionais TEXT
)
BEGIN
    DECLARE v_id_agendamento INT;
    DECLARE v_id_servico INT;

    -- Obter o último ID de agendamento
    SELECT MAX(id_agendamento) INTO v_id_agendamento FROM tbl_agendamentos;

    -- Obter o último ID de serviço
    SELECT MAX(id_servico) INTO v_id_servico FROM tbl_servicos;

    -- Inserir o novo registro na tabela tbl_servicos_agendamentos
    INSERT INTO tbl_servicos_agendamentos (detalhes_adicionais, id_agendamento, id_servico)
    VALUES (p_detalhes_adicionais, v_id_agendamento, v_id_servico);
END//

DELIMITER ;

CALL inserir_servico_agendamento('Só Água');

select * from tbl_servicos_agendamentos;




INSERT INTO tbl_servicos_agendamentos(detalhes_adicionais, id_agendamento, id_servico)VALUES
(null,
'2',
'2');

select * from vw_info_cliente_pelo_email;

drop view vw_cliente_agendamento;

create view vw_info_cliente_pelo_email as

-- Consultar informações do cliente, seu veículo, os serviços agendados, a data e o horário do agendamento com base no email do cliente
SELECT
    tbl_clientes.nome,
    tbl_clientes.email,
    tbl_clientes.telefone,
    tbl_veiculos.modelo,
    tbl_veiculos.marca,
    tbl_veiculos.ano,
    tbl_veiculos.placa,
    tbl_veiculos.cor,
    tbl_servicos.tipo_servico,
    tbl_servicos.descricao,
    tbl_datas.datas,
    tbl_horas.horas
FROM
    tbl_clientes
JOIN
    tbl_clientes_veiculos ON tbl_clientes.id_cliente = tbl_clientes_veiculos.id_cliente
JOIN
    tbl_veiculos ON tbl_clientes_veiculos.id_veiculo = tbl_veiculos.id_veiculo
JOIN
    tbl_agendamentos ON tbl_clientes.id_cliente = tbl_agendamentos.id_cliente_veiculo
JOIN
    tbl_datas_horarios ON tbl_agendamentos.id_data_horario = tbl_datas_horarios.id_data_horario
JOIN
    tbl_datas ON tbl_datas_horarios.id_data = tbl_datas.id_data
JOIN
    tbl_horas ON tbl_datas_horarios.id_horario = tbl_horas.id_horario
JOIN
    tbl_servicos_agendamentos ON tbl_agendamentos.id_agendamento = tbl_servicos_agendamentos.id_agendamento
JOIN
    tbl_servicos ON tbl_servicos_agendamentos.id_servico = tbl_servicos.id_servico
WHERE
     tbl_clientes.email = 'gustavo@gmail.com';