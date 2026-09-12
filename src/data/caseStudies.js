/* Long-form write-ups reached at /case-studies/<slug>.
   A project card shows the decision in one line; this is the room to show the
   reasoning behind it. Every fact here is one the author supplied. */

export const caseStudies = {
  'boom-pos': {
    slug: 'boom-pos',
    projectId: 'boom-pos',
    title: 'A checkout that keeps selling when the connection does not',
    client: 'Boom POS & CRM',
    role: 'Architecture · State design · Backend',
    tech: ['Next.js App Router', 'Zustand', 'API Routes', 'Flask', 'PostgreSQL'],
    metrics: [
      { value: '100+', label: 'sales a day' },
      { value: '500+', label: 'products in inventory' },
      { value: '2 months', label: 'from spec to production' }
    ],
    sections: [
      {
        heading: 'The problem',
        body: [
          'A point of sale is judged on one axis that most web applications never face: what happens at the exact moment money changes hands. Everything else about the system can be slow, awkward or ugly, and the business survives. A checkout that stalls with a customer standing there does not.',
          'The venue does not have reliable connectivity. That is not an edge case to handle later, it is the operating condition.'
        ]
      },
      {
        heading: 'The constraint that decided everything',
        body: [
          'A cashier adds items, changes quantities, removes a line, applies a discount. On a server-authoritative cart, every one of those keystrokes is a round trip, and every round trip is a chance for the interface to freeze on a network that is already unreliable.',
          'So the real question was not where the cart should live for correctness. It was which parts of a sale can tolerate a network round trip and which cannot.'
        ]
      },
      {
        heading: 'The decision',
        body: [
          'The working cart lives on the client in Zustand and never waits for the server. The server owns the ledger, and a completed sale posts as one transaction.',
          'That split follows the money. While a sale is being assembled it is a draft, and a draft that is lost costs a re-scan. Once it is completed it is a financial record, and a financial record that is lost or duplicated costs trust. Only the second half needs the server, so only the second half pays for the network.',
          'The alternative, a server-authoritative cart on every keystroke, is easier to reason about and was rejected for exactly the reason it is easier: it makes the network a dependency of every interaction rather than of one.'
        ]
      },
      {
        heading: 'The implementation',
        body: [
          'The front end is Next.js App Router with Zustand holding the cart. The back end is a Flask service on PostgreSQL, reached through Next.js API Routes, and it owns the transaction ledger and the CRM records.',
          'A completed sale carries a key generated on the client. The server treats a repeat of that key as the same transaction rather than a new one, which is what makes a retry over a dropping connection safe. Without that, the obvious failure is the worst one: the request succeeds, the response never arrives, the cashier presses the button again, and the customer is charged twice.'
        ]
      },
      {
        heading: 'What it does today',
        body: [
          'The platform handles more than a hundred sales a day across an inventory of more than five hundred products, paired with a CRM module for customer records. It went from specification to production in two months.'
        ]
      },
      {
        heading: 'What I would change',
        body: [
          'The reconciliation logic is the part I would rewrite. It works, but it lives in application code rather than in the data model, which means the rule for two terminals selling the same item is something a reader has to find rather than something the schema enforces. That is the same mistake I avoided on Revolt Laptop, where the constraint sits in the database.',
          'The second is the client cart itself. It survives a reload today, but it is not designed for a cashier switching devices mid-sale. That is a real scenario in a busy venue and it is currently unhandled rather than deliberately out of scope.'
        ]
      }
    ]
  },
  'anemivision': {
    slug: 'anemivision',
    projectId: 'anemivision',
    title: 'Anemia screening that works with the network switched off',
    client: 'Anemivision',
    role: 'Architecture · Model pipeline · Android',
    tech: ['Kotlin', 'Android', 'TensorFlow Lite', 'PyTorch', 'Computer Vision'],
    metrics: [
      { value: '0', label: 'patient images transmitted' },
      { value: 'On-device', label: 'inference, no API' },
      { value: 'Offline', label: 'by design, not fallback' }
    ],
    sections: [
      {
        heading: 'The problem',
        body: [
          'Anemia screening happens where the patients are, which is not where the bandwidth is. The clinics that most need a fast screening tool are the ones least able to rely on a connection to reach one.',
          'The input is also a photograph of a person. That single fact changes what kind of system this is allowed to be.'
        ]
      },
      {
        heading: 'The constraint that decided everything',
        body: [
          'A hosted inference API is the default answer and it fails twice here. It needs connectivity that the setting does not have, and it means patient images travel across a network and land on a server someone has to secure, audit and eventually delete.',
          'Health data you never collect is health data you cannot leak. That framing made the decision simpler than a security review would have.'
        ]
      },
      {
        heading: 'The decision',
        body: [
          'The model runs inside the Android application. A PyTorch model is quantized to TensorFlow Lite and ships in the binary, so inference happens on the device and no image is ever transmitted.',
          'Quantization is the price. Converting float32 weights to int8 shrinks the model enough to run on a phone CPU and costs some accuracy in exchange. The question was never whether quantization loses accuracy, it was whether that loss is smaller than the loss of a tool that does not work when there is no signal. In this setting it plainly is.'
        ]
      },
      {
        heading: 'The implementation',
        body: [
          'The application is native Android in Kotlin rather than cross-platform, because the work is camera capture and on-device inference, and both are places where the platform layer earns its cost.',
          'The model is trained in PyTorch and converted to TensorFlow Lite for the device runtime. Accuracy was compared between the float model and the quantized one before shipping, and inference was exercised on the device with the network switched off, because a feature that has never been run in its actual operating condition has not been tested.'
        ]
      },
      {
        heading: 'What it does today',
        body: [
          'The app performs screening entirely offline. No patient image leaves the phone, so there is no transmission to secure and no stored image to breach.'
        ]
      },
      {
        heading: 'What I would change',
        body: [
          'The update path is the weak point and it is inherent to the decision. A model inside the binary cannot be corrected without a release, so improving it is an app update and a store review rather than a deploy. If this were to grow, I would want a signed model file that can be updated separately from the application, which keeps inference local while making the model itself replaceable.',
          'I would also want the screening result to carry its own uncertainty. A number without a confidence interval invites more trust than a quantized model on a phone camera has earned, and in a medical context that is a design problem, not a UI detail.'
        ]
      }
    ]
  },
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
