# docker-compose

This directory contains configuration for Docker Compose, a quick way to get a
local HOCS environment on your computer.

To start all services, do:
```console
$ docker-compose up
```

This might take over five minutes to run.
The first time you run it Compose will download the latest images; this could
take an additional fifteen minutes, depending on your connection.

You&rsquo;ll also need to configure the database schema;
[see below for details](#missing-sql-tables).

You can also ask Compose to background the process (detach) once everything is
up and running:
```console
$ docker-compose up -d
```

To turn the containers off, press CTRL and C at the same time in that terminal
(SIGINT). Alternatively, run:
```console
$ docker-compose down
```

This will tear down the environment, so you&rsquo;ll have a lengthy wait when
starting the containers next time. If you&rsquo;re going to need the environment
again soon, consider instead using the equivalent of standby:

```console
$ docker-compose pause
$ docker-compose unpause
```

To only run the infrastructure containers (like PostgreSQL, AWS and ClamAV),
or to run the other HOCS services that aren&rsquo;t frontend, do:
```console
$ ./scripts/infrastructure.sh
$ ./scripts/services.sh
```

You can also run individual services. For example:
```console
$ docker-compose up frontend # localhost:8080
```

If you ask to bring up a service with a dependency, Compose will treat this
command as an implicit request to bring up the dependencies before bringing
up the dependant. If you don&rsquo;t want that, use:

```console
$ docker-compose up --no-deps frontend
```

If Docker doesn&rsquo;t have the images it needs, it will automatically
pull them. However, it won&rsquo;t pull existing images. If you want to run
the latest versions of services, remember to ask for them first:

```console
$ docker-compose pull
$ docker-compose up
```

## Troubleshooting
### Unhealthy containers

Docker Compose is configured so that containers that depend on other containers
don't get started until their dependencies are not only running, but also ready
for use.

If a container doesn't start working after a certain period of time, it will be
marked as &ldquo;unhealthy&rdquo; and Docker Compose will exit.

The error mesage will look something like this:

```console
ERROR: for frontend  Container "fe34db64b428" is unhealthy.
ERROR: Encountered errors while bringing up the project.
```

The hexadecimal number is the problematic container's ID.
You can check to see which container is misbehaving with:

```console
$ docker container ls
$ docker container logs fe34db64b428
```

(If you&rsquo;re new to Docker, the duration under &ldquo;STATUS&rdquo; is
generally more applicable here than the one under &ldquo;CREATED&rdquo;.)

This error is often due the process simply taking longer than usual to start,
and waiting a bit longer is enough to resolve the issue.

However, if you grow tired of waiting, or the logs look strange, you can usually
fix the problem by restarting the container:

```console
$ docker container restart fe34db64b428
```

Once the container is marked as &ldquo;healthy&rdquo; you can just pick the
the Docker Compose startup from where you left off:

```console
$ docker-compose up
```

For more serious problems you might need to tear down the environment with
`docker-compose down` and start again.

### Missing SQL tables

The info-service doesn&rsquo;t come with its schema, so if your PostgreSQL
container is new, like when yoursquo;re setting up your environment for the
first time, your info-service will complain about missing data;
you&rsquo;ll need to set the schema up manually.

The info-service schema isn&rsquo;t currently available publicly, and is stored
in a private repository on GitHub. Request access from an existing team member.
If you&rsquo;re working in Government but aren&rsquo;t a member of the DECS
development team, ask someone from the Home Office in the cross-Government Slack
channel to ask us on your behalf.

Depending on which version of HOCS you wish to run, clone the repository and
run the Docker Compose included in that repo:

```console
$ git clone git@github.com:UKHomeOffice/hocs-data.git
$ cd hocs-data
$ docker-compose up
```

```console
$ git clone git@github.com:UKHomeOffice/hocs-data-wcs.git
$ cd hocs-data-wcs
$ docker-compose up
```

You need to do this after the PostgreSQL server is ready, but before the
info-service pod is running. When you `docker-compose up` for the first time,
there&rsquo;s usually a short delay immediately after, when Localstack is
getting ready. That&rsquo;s the best time to `cd` into the schema and run these
commands.

### 403 on Frontend

The frontend container doesn&rsquo;t handle authentication, as it is handled
by a proxy before it hits the app. You&rsquo;ll need to set authentication
headers yourself using (for example) a browser extension. Ask an existing
developer for their copy. This might manifest itself as a browser timeout:
check stderr before assuming something else is wrong.
