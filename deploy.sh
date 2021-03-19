#!/bin/bash
set -euo pipefail

export IP_WHITELIST=${POISE_WHITELIST}
export KUBE_NAMESPACE=${ENVIRONMENT}
export KUBE_TOKEN=${KUBE_TOKEN}
export VERSION=${VERSION}
  
export DOMAIN="cs"
if [ ${KUBE_NAMESPACE%-*} == "wcs" ]; then
    export DOMAIN="wcs"
fi

if [[ ${KUBE_NAMESPACE} == *prod ]]
then
    export MIN_REPLICAS="2"
    export MAX_REPLICAS="6"
    export KUBE_SERVER=https://kube-api-prod.prod.acp.homeoffice.gov.uk
else
    export MIN_REPLICAS="1"
    export MAX_REPLICAS="2"
    export KC_REALM=https://sso-dev.notprod.homeoffice.gov.uk/auth/realms/hocs-notprod  
    export KUBE_SERVER=https://kube-api-notprod.notprod.acp.homeoffice.gov.uk
fi

if [[ "${KUBE_NAMESPACE}" == "wcs-prod" ]] ; then
    export DNS_PREFIX=www.wcs
    export KC_REALM=https://sso.digital.homeoffice.gov.uk/auth/realms/HOCS
elif [[ "${KUBE_NAMESPACE}" == "cs-prod" ]] ; then
    export DNS_PREFIX=www.cs
    export KC_REALM=https://sso.digital.homeoffice.gov.uk/auth/realms/hocs-prod
elif [[ "${KUBE_NAMESPACE}" == "cs-dev" ]] ; then
    export DNS_PREFIX=dev.internal.cs-notprod
elif [[ "${KUBE_NAMESPACE}" == "wcs-dev" ]] ; then
    export DNS_PREFIX=dev.internal.wcs-notprod
elif [[ "${KUBE_NAMESPACE}" == "cs-qa" ]] ; then
    export DNS_PREFIX=qa.internal.cs-notprod
elif [[ "${KUBE_NAMESPACE}" == "wcs-qa" ]] ; then
    export DNS_PREFIX=qa.internal.wcs-notprod
elif [[ "${KUBE_NAMESPACE}" == "cs-demo" ]] ; then
    export DNS_PREFIX=demo.cs-notprod
elif [[ "${KUBE_NAMESPACE}" == "wcs-demo" ]] ; then
    export DNS_PREFIX=demo.wcs-notprod
elif [[ "${KUBE_NAMESPACE}" == "hocs-qax" ]] ; then
    export DNS_PREFIX=qax.internal.cs-notprod
else
    export DNS_PREFIX=${ENVIRONMENT}.internal.${DOMAIN}-notprod
fi

export DNS_SUFFIX=.homeoffice.gov.uk
export DOMAIN_NAME=${DNS_PREFIX}${DNS_SUFFIX}

export INGRESS_TYPE="external"
if [[ $DNS_PREFIX == *"internal"* ]]; then
  export INGRESS_TYPE="internal"
fi

echo
echo "Deploying hocs-frontend to ${ENVIRONMENT}"
echo "Keycloak realm: ${KC_REALM}"
echo "Keycloak domain: ${KC_DOMAIN}"
echo "${INGRESS_TYPE} domain: ${DOMAIN_NAME}"
echo

cd kd

kd --insecure-skip-tls-verify \
   --timeout 10m \
    -f ingress-${INGRESS_TYPE}.yaml \
    -f converter-configmap.yaml \
    -f configmap.yaml \
    -f deployment.yaml \
    -f service.yaml \
    -f autoscale.yaml
