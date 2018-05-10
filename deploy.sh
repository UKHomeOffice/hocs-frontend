#!/bin/bash

export KUBE_NAMESPACE=${KUBE_NAMESPACE}
export KUBE_SERVER=${KUBE_SERVER}

if [[ -z ${VERSION} ]] ; then
    export VERSION=${IMAGE_VERSION}
fi

if [[ ${ENVIRONMENT} == "prod" ]] ; then
    echo "deploy ${VERSION} to pr namespace, using HOCS_FRONTEND_PROD drone secret"
    export KUBE_TOKEN=${HOCS_FRONTEND_PROD}
else
    if [[ ${ENVIRONMENT} == "qa" ]] ; then
        echo "deploy ${VERSION} to test namespace, using HOCS_FRONTEND_QA drone secret"
        export KUBE_TOKEN=${HOCS_FRONTEND_QA}
    else
        echo "deploy ${VERSION} to dev namespace, HOCS_FRONTEND_DEV drone secret"
        export KUBE_TOKEN=${HOCS_FRONTEND_DEV}
    fi
fi

if [[ -z ${KUBE_TOKEN} ]] ; then
    echo "Failed to find a value for KUBE_TOKEN - exiting"
    exit -1
fi

if [ "${ENVIRONMENT}" == "prod" ] ; then
    export DNS_PREFIX=
    export KC_REALM=hocs
else
    export DNS_PREFIX=${ENVIRONMENT}.notprod.
    export KC_REALM=hocs-notprod
fi

export DOMAIN_NAME=frontend.${DNS_PREFIX}cs.homeoffice.gov.uk

echo
echo "Deploying hocs-frontend to ${ENVIRONMENT}"
echo "Keycloak realm: ${KC_REALM}"
echo "domain name: ${DOMAIN_NAME}"
echo

cd kd

kd --insecure-skip-tls-verify \
    -f networkPolicy.yaml \
    -f ingress.yaml \
    -f deployment.yaml \
    -f service.yaml