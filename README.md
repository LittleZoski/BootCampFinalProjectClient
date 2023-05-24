# Facebook for Dogs - Front End

### Useful scripts

Development build `npm run dev`
Linting `npm run lint:fix`
React slick for the carousel `npm install react-slick --save`
Chakra UI `npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion`
React hook form `npm install react-hook-form`
React reach router `npm install @reach/router`

check with others to see if other dependencies are needed
If we setup a CI/CD pipeline, then linting will need to be performed in order for your branch to be approved.


To generate the protobufs run the following command, you will need to install some stuff that I don't remember at the moment.

`protoc -I=proto --ts_opt=target=web --ts_opt=json_names --ts_out=src/generated_proto message.proto --ts_opt=no_namespace`

You will then need to update the generated .ts file, as it targets a higher version of typescript than we target.
This update is just changing a private variable to not use the fancy private variable typescript syntax.
