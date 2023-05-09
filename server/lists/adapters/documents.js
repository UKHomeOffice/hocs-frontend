module.exports = async (data, { logger }) => {
    logger.debug('REQUEST_CASE_DOCUMENTS', { documents: data.documents.length });

    const reduceDocumentsByType = (groups, document) => {
        const group = groups.get(document.type);
        group && group.push(document);
        return groups;
    };

    const sortByTimeStamp = ({ timeStamp: timeStampA }, { timeStamp: timeStampB }) => {
        if (timeStampA > timeStampB) {
            return -1;
        } else if (timeStampA < timeStampB) {
            return 1;
        } else {
            return 0;
        }
    };

    const translateDocumentStatus = (status) => {
        const statusMap = {
            PENDING: 'Pending',
            FAILED_VIRUS: 'Malware Found',
            FAILED_MALWARE_SCAN: 'Malware Scan Failed',
            FAILED_CONVERSION: 'Failed PDF Conversion',
            AWAITING_MALWARE_SCAN: 'Awaiting Malware Scan',
            AWAITING_CONVERSION: 'Awaiting Document Conversion'
        };

        if (status === 'UPLOADED') {
            return;
        }

        const mappedStatus = statusMap[status];
        if (!mappedStatus) {
            logger.warn('REQUEST_CASE_DOCUMENTS', { message: `Unmapped status found: ${status}` });
        }

        return mappedStatus ?? status;
    };

    const generateTags = (labels, status) => {
        const tags = [];

        const translatedStatus = translateDocumentStatus(status);
        if (translatedStatus) {
            tags.push(translatedStatus);
        }

        return tags.concat(labels ?? []);
    };

    return [...data.documents
        .map(({ displayName, uuid, created, status, type, labels, hasPdf, hasOriginalFile }) => {
            return {
                label: displayName,
                status,
                timeStamp: created,
                type,
                value: uuid,
                tags: generateTags(labels, status),
                hasPdf,
                hasOriginalFile
            };
        })
        .reduce(reduceDocumentsByType, new Map(data.documentTags.map(label => [label, []])))]
        .map(([name, documents]) => [name, documents.sort(sortByTimeStamp)]);
};
