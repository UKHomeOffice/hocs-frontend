# HOCS Frontend
React application and NodeJs Server for server rendered dynamic forms.
## How to run
### Prerequisites
```
  NodeJs: >= v14.15.4
  Docker: >= v18.09.2
  Docker-Compose: >= v1.23.2
```
### Load backend services
```
  cd docker
  docker-compose pull
  ./scripts/infrastructure
  ./scripts/services
```
### Install dependencies run the application
```
  npm install
  npm run build-dev
  npm start
```

## Forms
HOCS Frontend consumes schemas from backend workflow services for display and validation purposes

### Schema
Forms comprise of three objects. 
- The Schema defines properties of the form and includes and array of Components that describe the fields. 
- The Data is a map of key/value pairs that correspond to the fields of the form, these values are injected in to the components at run time on the client when rendering the form. 
- The Meta object contains key/value pairs of meta-data that is used outside of the form context.
```
 {
     schema: {
         title: 'Test Form',
         defaultActionLabel: 'Submit',
         submissionUrl: '/api/endpoint',
         fields: [...component_array]
     },
     data: {
         ...form_data
     },
     meta: {
         ...form_meta
     }
 }
```
### Component
```
  {
    component: 'text',
    validation: [...validation_rules]
    props: {
      name: 'my_field',
      label: 'My Field',
      hint: 'This is a text component'
    }
```
Supported component types can be found in `./src/shared/common/components/forms/form-repository.jsx`
Supported validation types can be found in `./server.middleware/validation.js`
