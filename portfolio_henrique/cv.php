<?php 
// Lê o arquivo JSON
$dadosJson = file_get_contents("cv.json");
$usuario = json_decode($dadosJson, true);

?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?= $usuario['nome'] ?> - Currículo</title>
  <link rel="stylesheet" href="cv.css">
</head>
<body>
  <div class="container">
    <header>
      <h1><?= $usuario['nome'] ?></h1>
      <p class="contact">
        <strong>Email:</strong> <a href="mailto:hberdoldifiorotti@gmail.com"><?= $usuario['email'] ?></a><br>
        <strong>Github:</strong> <a href="https://github.com/Henrique-Fiorotti" target="_blank"><?= $usuario['github'] ?></a> |
        <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/henrique-berdoldi-fiorotti-4594bb291/" target="_blank">Henrique Berdoldi Fiorotti</a>
      </p>
    </header>

    <section class="section">
      <h2>OBJETIVO</h2>
      <p><?= $usuario['objetivo'] ?></p>
    </section>

    <section class="section">
      <h2>FORMAÇÃO ACADÊMICA</h2>
      <ul>
        <li><?= $usuario['formacaoAC']['formacao1'] ?></li>
        <li><?= $usuario['formacaoAC']['formacao2'] ?></li>
      </ul>
    </section>

    <section class="section">
      <h2>PROJETOS PESSOAIS</h2>
      <h3><?= $usuario['projetosP']['projeto1']['nome'] ?></h3>
      <ul>
        <li><?= $usuario['projetosP']['projeto1']['conteudo1'] ?></li>
        <li><?= $usuario['projetosP']['projeto1']['conteudo2'] ?></li>
        <li><?= $usuario['projetosP']['projeto1']['conteudo3'] ?></li>
      </ul>
      <h3><?= $usuario['projetosP']['projeto2']['nome'] ?></h3>
      <ul>
        <li><?= $usuario['projetosP']['projeto2']['conteudo1'] ?></li>
      </ul>
    </section>

    <section class="section">
      <h2>CURSOS E CERTIFICAÇÕES</h2>
      <ul>
        <li><?= $usuario['cursos']['curso1'] ?></li>
        <li><?= $usuario['cursos']['curso2'] ?></li>
        <li><?= $usuario['cursos']['curso3'] ?></li>
      </ul>
    </section>

    <section class="section">
      <h2>HARD SKILLS</h2>
      <ul>
        <li><strong><?= $usuario['hardSkills']['skill1']['skillnome'] ?></strong> <?= $usuario['hardSkills']['skill1']['skillconteudo'] ?></li>
        <li><strong><?= $usuario['hardSkills']['skill2']['skillnome'] ?></strong> <?= $usuario['hardSkills']['skill2']['skillconteudo'] ?></li>
        <li><strong><?= $usuario['hardSkills']['skill3']['skillnome'] ?></strong> <?= $usuario['hardSkills']['skill3']['skillconteudo'] ?></li>
        <li><strong><?= $usuario['hardSkills']['skill4']['skillnome'] ?></strong> <?= $usuario['hardSkills']['skill4']['skillconteudo'] ?></li>
        <li><strong><?= $usuario['hardSkills']['skill5']['skillnome'] ?></strong> <?= $usuario['hardSkills']['skill5']['skillconteudo'] ?></li>
      </ul>
    </section>

    <section class="section">
      <h2>SOFT SKILLS</h2>
      <ul>
        <li><?= $usuario['softSkills']['skill1']?></li>
        <li><?= $usuario['softSkills']['skill2']?></li>
        <li><?= $usuario['softSkills']['skill3']?></li>
      </ul>
    </section>

    <section class="section">
      <h2>IDIOMAS</h2>
      <ul>
        <li><?= $usuario['idioma']['idioma1']?></li>
        <li><?= $usuario['idioma']['idioma2']?></li>
        <li><?= $usuario['idioma']['idioma3']?></li>
      </ul>
    </section>
  </div>
</body>
</html>
