<!DOCTYPE html>
<html lang="en">

<head>

    <title>Formulario con Laravel</title>
</head>

<body>
    <h1>Formulario de Contacto</h1>
    <form action="/formulario" method="post">
        @csrf

        <label for="nombre">nombre</label>
        <input type="text" id="nombre" name="nombre" required>
        <br><br>

        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
        <br><br>

        <label for="mensaje">Mensaje</label>
        <textarea id="mensaje" name="mensaje" required></textarea>
        <br><br>

        <input type="submit" value="Enviar"></label>
    </form>
</body>

</html>