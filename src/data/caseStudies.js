/* Long-form write-ups reached at /case-studies/<slug>.
   A project card shows the decision in one line; this is the room to show the
   reasoning behind it. Every fact here is one the author supplied. */

export const caseStudies = {
  'geotop-certificates': {
    slug: 'geotop-certificates',
    projectId: 'geotop-certificates',
    title: 'Calibration certificates a technician can verify in the field',
    client: 'GEOTOP — surveying equipment',
    role: 'Architecture · Backend · Infrastructure',
    tech: ['Flask', 'Google Compute Engine', 'Nginx', 'S3-compatible object storage', 'QR'],
    metrics: [
      { value: '700+', label: 'certificates in the cloud' },
      { value: 'Seconds', label: 'to verify an instrument' },
      { value: '0', label: 'apps to install' }
    ],
    sections: [
      {
        heading: 'The problem',
        body: [
          'GEOTOP sells and services surveying equipment. Every instrument it calibrates gets a certificate, and that certificate was a sheet of paper. Paper is filed, copied, carried to sites, and lost.',
          'The consequence was not administrative, it was operational. With the instrument in hand, nobody could tell whether its calibration was still valid. There was no traceability from the physical device back to the document that vouched for it.'
        ]
      },
      {
        heading: 'The constraint that decided everything',
        body: [
          'The person who needs the answer is a technician standing in a field with the instrument in their hands. They may be far from an office, on a phone, with connectivity that is poor or intermittent.',
          'That single fact ruled out most of the obvious designs before any of them were built. Whatever the answer was, it had to work for someone who did not prepare for this moment.'
        ]
      },
      {
        heading: 'The decision',
        body: [
          'A printed QR code is stuck to the physical instrument. Scanning it resolves directly to that instrument\'s certificate, stored as a PDF in cloud object storage.',
          'The alternatives each failed the constraint. A mobile app asks a technician to install something before they can answer a question they have right now. A login asks them to hold credentials for a system that is not theirs, and to have signal enough to authenticate. An internal catalog means searching for the instrument by a serial number they would have to read off the device and type correctly.',
          'The QR removes every one of those steps. The identifier lives on the object itself, the phone already has the scanner, and the only thing the network has to deliver is one PDF. The document is the product, so the architecture does nothing but hand it over.'
        ]
      },
      {
        heading: 'The implementation',
        body: [
          'A Flask service runs on a VM provisioned on Google Compute Engine, with Nginx in front as a reverse proxy terminating the public traffic. Certificates live in S3-compatible object storage rather than in the database, so serving a document never touches application logic.',
          'The database records the instrument and points at its object. The QR encodes the route. Nothing in the read path needs to be clever, because the read path is the one that has to work on a bad connection.'
        ]
      },
      {
        heading: 'What it does today',
        body: [
          'More than 700 certificates are in the cloud and addressable from the equipment they belong to. Verification that used to mean a phone call and a filing cabinet is a scan and a few seconds.',
          'The traceability is the quiet part: a certificate is now attached to a physical object rather than to a folder someone has to maintain.'
        ]
      },
      {
        heading: 'What I would change',
        body: [
          'The read path assumes the network is there when the technician scans. It usually is, briefly, but a cached copy on the device after the first scan would make the worst case as good as the common one. That is the first thing I would add.',
          'The second is the VM. A single Google Compute Engine instance with Nginx in front is honest infrastructure for this load and I can reason about all of it, but it is also a machine I have to keep patched. For a service whose entire job is handing over static documents, that is more operational surface than the problem deserves.'
        ]
      }
    ]
  }
};

export default caseStudies;
