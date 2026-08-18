import { BlogPost, ContactMessage, Project, QuoteRequest, Service, SiteSettings, TeamMember, Testimonial, Profile } from '../types';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  company_name: 'BuildCore Construction & Engineering Ltd',
  company_tagline: 'Building Africa’s Enduring Infrastructure & Architectural Landmarks',
  nca_registration_number: 'NCA/1/0892/24 [NCA 1 ACCREDITED]',
  nca_category: 'NCA 1 - Building Works & Heavy Civil Engineering (Unlimited Value)',
  iso_certifications: 'ISO 9001:2015 (QMS) | ISO 14001:2015 (EMS) | ISO 45001:2018 (OH&S)',
  logo_url: '/logo.svg',
  phone: '+254 (0) 20 780 9000',
  emergency_phone: '+254 (0) 700 890 123',
  email: 'info@buildcore.co.ke',
  support_email: 'projects@buildcore.co.ke',
  address: 'BuildCore Towers, 8th Floor, Hospital Road, Upper Hill',
  city_country: 'Nairobi, Kenya (P.O. Box 45892-00100)',
  whatsapp_number: '+254700890123',
  google_maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.263595509935!2d36.812328!3d-1.298285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10dc0a6727d9%3A0x6b13cf0bcf773db6!2sUpper%20Hill%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000',
  business_hours: 'Monday – Friday: 07:30 – 17:30 | Saturday: 08:00 – 13:00 (Site Works 24/7 as per Shift Plan)',
  about_summary: 'BuildCore Construction & Engineering Ltd is East Africa’s premier tier-one engineering, procurement, and construction (EPC) contractor. Registered with the National Construction Authority (NCA-1) with unlimited project value capacity, we have delivered over 180+ mission-critical commercial, civil, and industrial developments across Kenya and East Africa over the last 24 years.',
  mission: 'To construct enduring, sustainable, and engineering-sound infrastructure that accelerates socio-economic development across East Africa with zero-harm safety standards.',
  vision: 'To be the most trusted, innovative, and technologically advanced African construction conglomerate by 2030.',
  core_values: [
    'Safety First (Zero Harm Policy)',
    'Engineering Precision & Uncompromising Quality',
    'Ethical Integrity & Strict Compliance',
    'Timely Delivery & Value Engineering',
    'Environmental Sustainability'
  ],
  stats_experience_years: 24,
  stats_projects_completed: 184,
  stats_workforce_count: 1450,
  stats_safety_record_hours: '6.2M+ Safe Man-Hours without LTI',
  social_facebook: 'https://facebook.com/buildcorekenya',
  social_linkedin: 'https://linkedin.com/company/buildcore-construction',
  social_twitter: 'https://twitter.com/buildcore_ke',
  social_instagram: 'https://instagram.com/buildcore_ke'
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    title: 'Commercial & High-Rise Construction',
    slug: 'commercial-high-rise-construction',
    category: 'Commercial',
    short_description: 'Turnkey construction of multi-storey corporate headquarters, retail malls, mixed-use complexes, and hotel towers.',
    description: 'We specialize in complex high-rise structural systems, deep basements with advanced dewatering and diaphragm walls, post-tensioned slabs, intelligent building management systems, and LEED/EDGE-certified sustainable construction. Our multidisciplinary engineering teams leverage BIM (Building Information Modeling) for clash detection and seamless execution.',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    icon: 'Building2',
    features: [
      'Post-Tensioned Concrete & Structural Steel Systems',
      'Deep Foundation Piling & Diaphragm Retaining Walls',
      'EDGE & LEED Green Building Compliance',
      'BIM Level 2 Coordination & Clash Avoidance',
      'Integrated Building Management (BMS) & HVAC Systems'
    ],
    active: true,
    display_order: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'srv-2',
    title: 'Civil Infrastructure & Heavy Engineering',
    slug: 'civil-infrastructure-heavy-engineering',
    category: 'Civil Works',
    short_description: 'Bridges, interchanges, bulk water handling systems, storm water drainage, and port logistics facilities.',
    description: 'Our heavy civil division executes large-scale public and private infrastructure projects. From multi-span reinforced concrete bridges and urban overpasses to massive water treatment reservoirs and seaport pavements, we deploy heavy plant machinery, automated surveying, and rigorous geotechnical engineering to guarantee century-long durability.',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
    icon: 'HardHat',
    features: [
      'Pre-stressed Concrete Bridges & Box Girder Flyovers',
      'Bulk Earthworks & Mechanized Terrain Stabilization',
      'Stormwater Arteries, Culverts & Flood Control Canals',
      'Water Treatment Plants & Pumping Stations',
      'Heavy-Duty Port & Rail Yard Pavement Slabs'
    ],
    active: true,
    display_order: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'srv-3',
    title: 'Road & Highway Construction',
    slug: 'road-highway-construction',
    category: 'Civil Works',
    short_description: 'Asphalt paving, concrete dual-carriageways, rural access roads, and airport taxiway runways.',
    description: 'We manage full lifecycle highway projects from initial route surveying and soil stabilization to asphalt concrete surfacing, intelligent transport signalling, and environmental restoration. Our self-owned asphalt batching plants and fleet of pavers ensure uncompromising adherence to KeNHA and international road standards.',
    image_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
    icon: 'Navigation',
    features: [
      'Superpave Asphalt Concrete & Polymer Modified Bitumen',
      'Lime & Cement Subgrade Geotechnical Stabilization',
      'Automated Grade-Control Laser Paving',
      'Drainage Structures, Armco Pipes & Retaining Gabions',
      'Highway Signage, Thermoplastic Markings & Guardrails'
    ],
    active: true,
    display_order: 3,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'srv-4',
    title: 'Industrial Facilities & Warehousing',
    slug: 'industrial-facilities-warehousing',
    category: 'Industrial',
    short_description: 'Pre-engineered steel warehouses, food-grade manufacturing plants, and heavy logistics parks.',
    description: 'We construct state-of-the-art industrial facilities featuring long-span PEB steel frames, super-flat laser-screeded concrete floors (FM2 tolerance), cold storage insulation, and specialized industrial MEP installations tailored for high throughput manufacturing and distribution.',
    image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    icon: 'Factory',
    features: [
      'High-Bay Pre-Engineered Structural Steel Framing',
      'Super-Flat Concrete Flooring (Laser-Screeded with Dry-Shake Hardener)',
      'Substation, Transformer & High-Voltage Power Distribution',
      'NFPA-Compliant Fire Hydrant & Foam Suppression Networks',
      'Overhead Gantry Cranes & Dock Leveler Loading Bays'
    ],
    active: true,
    display_order: 4,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'srv-5',
    title: 'Residential Estates & Luxury Developments',
    slug: 'residential-estates-luxury-developments',
    category: 'Residential',
    short_description: 'Gated master-planned communities, luxury multi-family apartments, and bespoke private residences.',
    description: 'Delivering exceptional residential environments that unite architectural elegance with enduring structural resilience. We execute turnkey residential developments with clubhouse amenities, solar microgrids, advanced perimeter security, and refined custom interior joinery.',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    icon: 'Home',
    features: [
      'Master-Planned Gated Community Infrastructure',
      'High-End Architectural Finishes & Imported Glazing',
      'Off-Grid Solar PV & Hybrid Battery Integration',
      'Rainwater Harvesting & On-Site Sewage Bio-Digesters',
      'Smart Home Automation & Access Security Gates'
    ],
    active: true,
    display_order: 5,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'srv-6',
    title: 'Interior Fit-Out & Architectural Finishing',
    slug: 'interior-fit-out-architectural-finishing',
    category: 'Fit-Out',
    short_description: 'High-specification corporate workspaces, luxury hospitality interiors, and clinical hospital finishes.',
    description: 'Transforming shell-and-core properties into functional, breathtaking spaces. Our fit-out craftsmen and MEP specialists execute acoustic ceilings, glazed demountable partitions, specialized floor finishes, bespoke cabinetry, and smart workplace technology with rapid turnaround.',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    icon: 'Paintbrush',
    features: [
      'Acoustic Ceiling Systems & Architectural Lighting',
      'Frameless Glass Partitions & Sound-Insulated Pods',
      'Bespoke Joinery, Millwork & Executive Reception Counters',
      'HVAC Ducting, Server Room CRAC & Data Cabling (Cat6A/Fiber)',
      'Healthcare-Grade Anti-Bacterial Vinyl & Seamless Epoxy Floors'
    ],
    active: true,
    display_order: 6,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'srv-7',
    title: 'Project Management & Turnkey EPC',
    slug: 'project-management-turnkey-epc',
    category: 'Management',
    short_description: 'Engineering, Procurement, and Construction management with single-point accountability and guaranteed delivery.',
    description: 'We oversee the entire lifecycle from preliminary feasibility studies, statutory approvals (NCA, NEMA, County approvals), procurement of long-lead items, to site supervision and commissioning. Clients benefit from fixed-price contracts and zero cost-overruns.',
    image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    icon: 'ClipboardCheck',
    features: [
      'Full Statutory Approvals Management (NCA, NEMA, WRA, Fire Safety)',
      'Value Engineering & Guaranteed Maximum Price (GMP) Models',
      'Earned Value Management (EVM) Real-Time Scheduling',
      'Supply Chain & Global Logistics Procurement Handling',
      'Comprehensive Commissioning & Post-Handover Defect Liability Support'
    ],
    active: true,
    display_order: 7,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'srv-8',
    title: 'Structural Retrofitting & Renovation',
    slug: 'structural-retrofitting-renovation',
    category: 'Renovation',
    short_description: 'Carbon fiber (CFRP) strengthening, seismic rehabilitation, structural repairs, and adaptive reuse.',
    description: 'Restoring and upgrading existing commercial and historical structures. Utilizing cutting-edge carbon fiber wraps, micro-concrete jacketing, foundation underpinning, and non-destructive testing (NDT) to restore structural integrity without demolition.',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    icon: 'ShieldCheck',
    features: [
      'Carbon Fiber Reinforced Polymer (CFRP) Beam & Column Wrapping',
      'Foundation Underpinning & Micropile Strengthening',
      'Non-Destructive Testing (Rebound Hammer, Ultrasonic Pulse & Core Drilling)',
      'Seismic Shock Absorbers & Expansion Joint Replacement',
      'Heritage Building Facade Conservation & Structural Upgrades'
    ],
    active: true,
    display_order: 8,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Nairobi Financial Centre Tower',
    slug: 'nairobi-financial-centre-tower',
    project_type: 'Commercial',
    status: 'Completed',
    location: 'Upper Hill, Nairobi, Kenya',
    client: 'Kenya Commercial Real Estate Holdings',
    budget: 'KES 4.85 Billion ($37.5M USD)',
    start_date: '2021-03-15',
    completion_date: '2024-06-30',
    square_meters: '42,500 m²',
    architect: 'Triad Architects & Foster Global Partners',
    featured: true,
    short_description: 'A 32-storey Grade-A commercial office landmark with 4 subterranean parking levels, double-glazed curtain wall, and EDGE Advanced green certification.',
    description: 'The Nairobi Financial Centre Tower represents the pinnacle of commercial high-rise engineering in East Africa. Built to house international financial institutions, the tower features an ultra-deep 18-meter basement excavation in fractured volcanic bedrock with anchor-tied contiguous piling. The superstructure utilizes high-strength 60 MPa self-compacting concrete, post-tensioned floor plates allowing column-free spans of up to 14 meters, and a low-E double glazed unitized facade that cuts solar heat gain by 42%.',
    challenges: 'High water table near the Ngong River tributary required 24/7 dewatering with automated piezometer sensors and heavy-duty bentonite slurry diaphragm walls. Restricted urban traffic in Upper Hill mandated just-in-time night concrete pours.',
    solutions: 'Deployed advanced 3D BIM coordination to orchestrate 120 subcontracting teams and pioneered off-site prefabricated rebar cages which shaved 14 weeks off the original structural schedule.',
    cover_image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    images: [
      { id: 'img-1-1', project_id: 'proj-1', image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', caption: 'Exterior facade during dusk completion', display_order: 1, created_at: '2024-01-01T00:00:00Z' },
      { id: 'img-1-2', project_id: 'proj-1', image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', caption: 'Triple-height atrium lobby and reception', display_order: 2, created_at: '2024-01-01T00:00:00Z' },
      { id: 'img-1-3', project_id: 'proj-1', image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', caption: 'Executive boardroom and panoramic office floor', display_order: 3, created_at: '2024-01-01T00:00:00Z' }
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'proj-2',
    title: 'Kilindini Deepwater Logistics Terminal',
    slug: 'kilindini-deepwater-logistics-terminal',
    project_type: 'Civil Works',
    status: 'Completed',
    location: 'Mombasa Seaport, Coastal Kenya',
    client: 'Kenya Ports Authority & Regional Transit Consortium',
    budget: 'KES 7.20 Billion ($55.8M USD)',
    start_date: '2020-08-01',
    completion_date: '2023-11-20',
    square_meters: '260,000 m²',
    architect: 'Maritime Civil Engineering Consultants',
    featured: true,
    short_description: 'Heavy maritime civil engineering project featuring 260,000 m² of laser-screeded heavy-duty block pavement, rail intermodal sidings, and substations.',
    description: 'Constructed to expand throughput capacity for the Northern Corridor transit trade. The project involved maritime land reclamation, dynamic soil compaction across coastal sand dunes, high-density heavy-duty interlocking concrete block paving rated for 120-ton reach stacker axle loads, and dual-redundant storm surge drainage.',
    challenges: 'Corrosive marine environment with severe chloride attack potential and ongoing port operations that could not be disrupted during construction.',
    solutions: 'Utilized slag-blended sulphate-resisting cement (SRC), cathodic rebar protection, and prefabricated precast box culverts installed during scheduled low-tide windows.',
    cover_image_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
    images: [
      { id: 'img-2-1', project_id: 'proj-2', image_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80', caption: 'Aerial view of the heavy container terminal yard', display_order: 1, created_at: '2024-01-01T00:00:00Z' },
      { id: 'img-2-2', project_id: 'proj-2', image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80', caption: 'Heavy-duty laser grading and paving execution', display_order: 2, created_at: '2024-01-01T00:00:00Z' }
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'proj-3',
    title: 'Great Rift Highway & Mau Escarpment Expansion',
    slug: 'great-rift-highway-mau-escarpment-expansion',
    project_type: 'Infrastructure',
    status: 'In Progress',
    location: 'Nakuru - Mau Summit Corridor, Kenya',
    client: 'Kenya National Highways Authority (KeNHA)',
    budget: 'KES 11.40 Billion ($88.3M USD)',
    start_date: '2023-02-10',
    completion_date: '2026-12-15',
    square_meters: '68 Kilometres Dual Carriageway',
    architect: 'BuildCore Civil & Geotechnical Consortium',
    featured: true,
    short_description: 'Dual-carriageway transformation of a vital transport artery featuring 4 major viaduct interchanges, climbing lanes, and advanced slope stabilization.',
    description: 'Upgrading the congested two-lane trunk road into a modern Class-A dual-carriageway. The scope spans 68 km of heavy asphalt pavement, 8 reinforced concrete overpasses, 2 major river bridges across the Molo River basin, and extensive soil-nailing and rockfall netting on treacherous Rift Valley volcanic slopes.',
    challenges: 'Unstable volcanic ash soils prone to landslides during high rainfall seasons and severe heavy truck freight volume.',
    solutions: 'Engineered lime-pozzolana subgrade stabilization, geogrid reinforcement mats, and deployed 3 concrete batching plants along the corridor to achieve 400 linear meters of asphalt paving daily.',
    cover_image_url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80',
    images: [
      { id: 'img-3-1', project_id: 'proj-3', image_url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80', caption: 'Escarpment flyover viaduct concrete pier casting', display_order: 1, created_at: '2024-01-01T00:00:00Z' }
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'proj-4',
    title: 'Amani Ridge Luxury Eco-Residences',
    slug: 'amani-ridge-luxury-eco-residences',
    project_type: 'Residential',
    status: 'In Progress',
    location: 'Karen, Nairobi, Kenya',
    client: 'Amani Heritage Developments Ltd',
    budget: 'KES 2.40 Billion ($18.6M USD)',
    start_date: '2023-09-01',
    completion_date: '2025-08-30',
    square_meters: '36,000 m² (42 Villas & Country Clubhouse)',
    architect: 'Studio SYM Africa & Eco-Design Consult',
    featured: true,
    short_description: 'An exclusive gated development of 42 high-efficiency sustainable villas with timber truss roofs, solar microgrids, and natural stone facades.',
    description: 'Designed to blend organically with the indigenous forest canopy of Karen. Each villa features thermal mass masonry, localized rainwater retention basins, double-glazed timber-clad windows, infinity swimming pools, and an on-site solar battery microgrid that produces 85% of total annual energy demand.',
    challenges: 'Zero-harm environmental constraint requiring preservation of 94% of mature indigenous trees on site.',
    solutions: 'Used micro-excavators and tree root radar mapping during foundation footings. Replaced conventional perimeter walls with stone gabions and live thorn hedges.',
    cover_image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    images: [
      { id: 'img-4-1', project_id: 'proj-4', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', caption: 'Completed prototype villa and manicured gardens', display_order: 1, created_at: '2024-01-01T00:00:00Z' },
      { id: 'img-4-2', project_id: 'proj-4', image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', caption: 'Clubhouse and private pool deck', display_order: 2, created_at: '2024-01-01T00:00:00Z' }
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'proj-5',
    title: 'Afya Bora Specialist Hospital & Surgical Wing',
    slug: 'afya-bora-specialist-hospital-surgical-wing',
    project_type: 'Healthcare',
    status: 'Completed',
    location: 'Westlands, Nairobi, Kenya',
    client: 'Afya Health Care Group East Africa',
    budget: 'KES 3.10 Billion ($24.0M USD)',
    start_date: '2022-01-10',
    completion_date: '2024-02-28',
    square_meters: '18,500 m² (200 Beds & 8 Modular Theatres)',
    architect: 'Medical Architecture International',
    featured: false,
    short_description: 'Ultra-modern tertiary hospital complex with 8 laminar flow modular surgical suites, ICU isolation wards, and medical gas pipeline networks.',
    description: 'A benchmark in specialized healthcare engineering in Sub-Saharan Africa. The facility includes heavy radiation-shielded bunker walls for linear accelerators and MRI suites, medical-grade HEPA HVAC filtration systems guaranteeing 25 air changes per hour in operating theatres, and triple-redundant uninterruptible power systems.',
    challenges: 'Extremely stringent acoustic and vibration tolerances for sensitive neurosurgery microscopes situated adjacent to major urban roadways.',
    solutions: 'Isolated the surgical block on elastomeric vibration-damping foundation bearings and installed triple-seal acoustic doors and acoustic wall panels.',
    cover_image_url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80',
    images: [
      { id: 'img-5-1', project_id: 'proj-5', image_url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80', caption: 'Main medical facility entrance and ambulance bay', display_order: 1, created_at: '2024-01-01T00:00:00Z' }
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'proj-6',
    title: 'Naivasha Geothermal Industrial Park',
    slug: 'naivasha-geothermal-industrial-park',
    project_type: 'Industrial',
    status: 'In Progress',
    location: 'Naivasha Special Economic Zone (SEZ), Kenya',
    client: 'Olkaria Green Logistics Joint Venture',
    budget: 'KES 6.30 Billion ($48.8M USD)',
    start_date: '2024-01-15',
    completion_date: '2026-06-30',
    square_meters: '140,000 m² under roof',
    architect: 'BuildCore Industrial EPC Division',
    featured: false,
    short_description: 'Heavy industrial logistics facility directly powered by geothermal clean steam, featuring 6 clear-span steel warehouse blocks and rail link.',
    description: 'Constructing the first green industrial park in East Africa running 100% on direct geothermal power and process steam. Scope includes massive PEB steel erection, 4.5 km of dedicated rail spur line connecting directly to the Standard Gauge Railway (SGR), and high-capacity stormwater catchment ponds.',
    challenges: 'High hydrogen sulfide (H2S) atmospheric concentration from nearby geothermal fumaroles.',
    solutions: 'Applied specialized epoxy-phenolic multi-coat protective finishes to all structural steel and electrical switchgear contacts.',
    cover_image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    images: [
      { id: 'img-6-1', project_id: 'proj-6', image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80', caption: 'Steel truss structure during assembly', display_order: 1, created_at: '2024-01-01T00:00:00Z' }
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    customer_name: 'Dr. Kennedy Waweru',
    company: 'Director of Infrastructure, KCRE Holdings',
    content: 'BuildCore delivered the 32-storey Nairobi Financial Centre Tower two months ahead of schedule and with zero serious safety incidents. Their engineering acumen, post-tensioned slab execution, and transparent cost reporting set an unbeatable benchmark for tier-one contractors in Sub-Saharan Africa.',
    rating: 5,
    featured: true,
    active: true,
    project_reference: 'Nairobi Financial Centre Tower',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 't-2',
    customer_name: 'Eng. Mariam Salim',
    company: 'Senior Port Engineer, Kenya Ports Authority',
    content: 'Constructing heavy-duty container yard pavements in aggressive marine conditions requires unmatched technical discipline. BuildCore demonstrated superior concrete mix designs, heavy laser compaction, and excellent project coordination under high-pressure port operating conditions.',
    rating: 5,
    featured: true,
    active: true,
    project_reference: 'Kilindini Deepwater Logistics Terminal',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 't-3',
    customer_name: 'Julian Montgomery',
    company: 'Managing Partner, Amani Heritage Developments',
    content: 'Our vision for Amani Ridge was high-sustainability luxury without disrupting the Karen forest ecosystem. BuildCore lived up to every promise. Their attention to bespoke joinery, stone cladding, and on-site solar microgrid installation is truly masterclass.',
    rating: 5,
    featured: true,
    active: true,
    project_reference: 'Amani Ridge Luxury Eco-Residences',
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Eng. David Kipkorir, PE, FIEK',
    position: 'Chief Executive Officer & Managing Director',
    biography: 'Over 28 years of civil and structural engineering leadership across East and Southern Africa. Fellow of the Institution of Engineers of Kenya (IEK) and registered Professional Engineer with the Engineers Board of Kenya (EBK). Former lead infrastructure advisor to regional EPC ventures.',
    image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    email: 'd.kipkorir@buildcore.co.ke',
    phone: '+254 20 780 9001',
    display_order: 1,
    active: true,
    qualifications: ['BSc Civil Engineering (UoN)', 'MSc Structural Dynamics (Imperial College London)', 'Fellow, IEK (FIEK)', 'Registered Consulting Engineer (EBK)'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'team-2',
    name: 'Eng. Amina Hassan, MSc, MIEK',
    position: 'Chief Technical Officer & Head of Structural Engineering',
    biography: 'Expert in seismic engineering, post-tensioned high-rise concrete systems, and Building Information Modeling (BIM Level 2). Has spearheaded over 40 major structural designs including hospital trauma wings and corporate towers.',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    email: 'a.hassan@buildcore.co.ke',
    phone: '+254 20 780 9002',
    display_order: 2,
    active: true,
    qualifications: ['BSc Civil Engineering (Makerere)', 'MSc Structural & Foundation Engineering (UCT)', 'Member, IEK (MIEK)', 'Autodesk Certified BIM Professional'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'team-3',
    name: 'Eng. Samuel Ochieng, PMP, MICE',
    position: 'Chief Operations Officer & Head of Heavy Civil Works',
    biography: 'Seasoned project director with 22 years overseeing mega highway corridors, railway terminals, and deep foundation marine works. Certified Project Management Professional (PMP) and Member of the Institution of Civil Engineers (UK).',
    image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    email: 's.ochieng@buildcore.co.ke',
    phone: '+254 20 780 9003',
    display_order: 3,
    active: true,
    qualifications: ['BSc Civil Engineering (JKUAT)', 'PMP (Project Management Institute)', 'Member, ICE (UK)', 'FIDIC Certified Contract Administrator'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'team-4',
    name: 'Grace Mwangi, MSc, NEBOSH Dip',
    position: 'Head of Quality, Health, Safety & Environment (QHSE)',
    biography: 'Champions BuildCore’s Zero-Harm and ISO 45001 safety culture across all active sites. Oversaw the milestone achievement of 6.2 million safe man-hours without a Lost Time Injury (LTI) in 2023–2024.',
    image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    email: 'g.mwangi@buildcore.co.ke',
    phone: '+254 20 780 9004',
    display_order: 4,
    active: true,
    qualifications: ['NEBOSH International Diploma in OH&S', 'MSc Environmental Science', 'Lead Auditor ISO 9001/14001/45001', 'Certified Safety Professional (CSP)'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Future of High-Rise Engineering: Adapting Post-Tensioned Concrete in Tropical Climates',
    slug: 'future-of-high-rise-engineering-post-tensioned-concrete',
    excerpt: 'How post-tensioned concrete technology and 60 MPa self-compacting mixes are revolutionizing commercial real estate in East Africa by reducing structural deadweight and eliminating columns.',
    content: `High-rise construction across East Africa’s rapidly expanding urban skylines—from Nairobi’s Upper Hill to Kampala and Kigali—is experiencing a transformative technological shift. As corporate tenants demand large, column-free floor plates with maximum daylight penetration, traditional cast-in-situ reinforced concrete slabs are being superseded by post-tensioned (PT) bonded concrete systems.

### 1. Structural Efficiency & Material Savings
Post-tensioning involves placing high-strength unbonded or bonded steel tendons inside ducting within concrete forms before pouring. Once the concrete reaches approximately 70% of its characteristic compressive strength (typically within 72 hours with self-compacting high-early-strength mixes), hydraulic jacks tension the tendons to predetermined loads.

This introduces internal compressive stresses that counterbalance tensile bending moments created by gravity and live occupancy loads. As a result:
- Slab thicknesses can be reduced by 25% to 35% (e.g. from 300 mm standard RC slab down to 200 mm PT flat plate).
- Overall building dead load is reduced by up to 28%, significantly lowering seismic base shear and allowing smaller foundation pile caps.
- Story heights are compressed by 100–150 mm per floor, allowing developers to gain an additional usable commercial floor in a 30-storey building envelope without exceeding municipal zoning height limits.

### 2. Deflection Control and Crack Mitigation
In tropical climates characterized by sharp diurnal temperature variations, early-stage thermal cracking in large-area concrete pours represents a critical maintenance liability. The axial pre-compression induced by PT tendons virtually eliminates shrinkage micro-cracking and maintains long-term deflection within L/1000 tolerances—ideal for seamless installation of frameless glass curtain walls and laser-leveled raised access flooring.

### 3. Conclusion & Best Practices
At BuildCore, our structural division utilizes 3D finite element modeling (RAM Concept and ETABS) to optimize tendon profiling and anchor placement. Combined with strict batching quality control and automated digital elongation monitoring, PT technology enables us to deliver commercial landmarks that are structurally superior, economically optimized, and built to endure for generations.`,
    cover_image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    category: 'Structural Engineering',
    author_name: 'Eng. Amina Hassan, CTO',
    read_time_minutes: 6,
    tags: ['Civil Engineering', 'Concrete Technology', 'High-Rise', 'BIM'],
    published: true,
    published_at: '2024-05-10T10:00:00Z',
    created_at: '2024-05-10T10:00:00Z',
    updated_at: '2024-05-10T10:00:00Z'
  },
  {
    id: 'post-2',
    title: 'Navigating Kenya’s NCA 1 Compliance, Quality Audits & Statutory Permitting in 2025',
    slug: 'navigating-kenyas-nca-1-compliance-statutory-permitting',
    excerpt: 'A comprehensive guide for institutional developers and asset managers on statutory approvals, NEMA environmental impact assessments, and zero-defect QA/QC protocols.',
    content: `Executing a multi-billion-shilling construction project in Kenya requires absolute mastery of the statutory regulatory framework. From the National Construction Authority (NCA) regulations to National Environment Management Authority (NEMA) licenses and County planning approvals, compliance is the cornerstone of project bankability.

### The Critical Approval Milestone Pipeline
1. **Zoning & Architectural Masterplan Approval**: County Government development permits (PPA 1 & PPA 2 forms) verifying land zoning, plot ratio, and ground coverage compliance.
2. **NEMA Environmental & Social Impact Assessment (ESIA)**: Comprehensive baseline studies evaluating stormwater discharge, noise attenuation, carbon footprint, and community engagement.
3. **NCA Project Registration & Quality Assurance Auditing**: Under NCA regulations, all commercial works above statutory thresholds must be registered, led by an accredited NCA contractor, and overseen by certified site supervisors holding NCA accreditation cards.
4. **Water Resources Authority (WRA) & Kenya Civil Aviation Authority (KCAA)**: Mandatory for deep borehole abstraction and high-rise developments located within airport flight paths.

### Zero-Defect Quality Assurance on Site
Statutory compliance does not stop with permits; it requires verifiable on-site material testing:
- **Cube Compressive Strength Testing**: Standard 7-day, 14-day, and 28-day concrete cube crushing tests conducted in KEBS-certified laboratories.
- **Rebar Yield Strength & Chemical Composition**: Verifying tensile yield strength ($f_y \ge 500 \text{ MPa}$) and weldability.
- **Compaction Density Verification**: Nuclear gauge and sand replacement tests ensuring subgrades attain $\ge 98\%$ MDD (Maximum Dry Density).

At BuildCore, our dedicated regulatory and QA/QC liaison team manages all statutory submissions, ensuring zero delays in site mobilization and absolute legal compliance for our developer partners.`,
    cover_image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    category: 'Regulatory & Management',
    author_name: 'Eng. Samuel Ochieng, COO',
    read_time_minutes: 5,
    tags: ['NCA 1', 'Compliance', 'Quality Assurance', 'Construction Management'],
    published: true,
    published_at: '2024-04-18T14:30:00Z',
    created_at: '2024-04-18T14:30:00Z',
    updated_at: '2024-04-18T14:30:00Z'
  },
  {
    id: 'post-3',
    title: 'Zero-Harm Safety Culture: Achieving 6 Million Safe Man-Hours on Mega Infrastructure Sites',
    slug: 'zero-harm-safety-culture-6-million-safe-man-hours',
    excerpt: 'Discover the rigorous HSE protocols, daily tool-box talks, and risk assessment matrices that make BuildCore one of the safest heavy construction firms in Africa.',
    content: `In heavy civil and high-rise construction, safety is not merely a compliance checklist—it is an uncompromising moral imperative and our primary operational metric. At BuildCore, every single person who steps onto our project sites is guaranteed a safe working environment.

### 1. The Hierarchy of Safety Controls
We implement ISO 45001:2018 (Occupational Health & Safety) systems anchored on proactive hazard elimination:
- **Daily Pre-Task Risk Assessments (Toolbox Talks)**: Every morning before machinery starts, supervisors and trade crews review specific job safety analyses (JSA).
- **Fall Protection & Scaffolding Standards**: 100% tie-off rules on all works above 1.8 meters, certified scaffolding tag systems (Scafftag), and safety net perimeter fans.
- **Heavy Plant & Traffic Segregation**: Strict separation between pedestrian pathways and heavy earthmoving plant with automated blind-spot radar alarms.

### 2. Behavioral Safety & Worker Empowerment
Safety excellence occurs when every worker has the authority to stop any activity they deem unsafe without fear of reprimand. Our "Stop-Work-Authority" (SWA) program empowers all 1,450+ workers across our sites to intervene immediately when an unsafe condition is observed.

Through continuous training and rigorous incident root-cause analysis, we are proud to maintain an industry-leading safety record with over 6.2 million consecutive safe man-hours without a Lost Time Injury (LTI).`,
    cover_image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    category: 'Health, Safety & Environment',
    author_name: 'Grace Mwangi, Head of QHSE',
    read_time_minutes: 4,
    tags: ['HSE', 'ISO 45001', 'Safety Standards', 'Zero Harm'],
    published: true,
    published_at: '2024-03-22T08:15:00Z',
    created_at: '2024-03-22T08:15:00Z',
    updated_at: '2024-03-22T08:15:00Z'
  }
];

export const INITIAL_QUOTE_REQUESTS: QuoteRequest[] = [
  {
    id: 'qr-1',
    user_id: null,
    name: 'Arch. Evans Maina',
    email: 'e.maina@landmarkdev.co.ke',
    phone: '+254 722 889 900',
    project_type: 'Commercial High-Rise',
    location: 'Westlands, Nairobi',
    budget: 'KES 2.5B - 5B ($20M - $40M USD)',
    preferred_start_date: '2025-06-01',
    description: 'Proposed 24-storey mixed-use commercial tower with 3 basement levels. Seeking complete turnkey EPC structural, civil, and MEP contracting services.',
    status: 'Site Visit Scheduled',
    admin_notes: 'Initial structural feasibility meeting conducted on 12th Aug. Geotechnical soil report requested from client. Site visit scheduled with Eng. Amina.',
    estimated_quote_amount: 'KES 3,250,000,000',
    created_at: '2024-08-10T11:20:00Z',
    updated_at: '2024-08-12T15:40:00Z'
  },
  {
    id: 'qr-2',
    user_id: null,
    name: 'Beatrice Ndung’u',
    email: 'b.ndungu@agrilogistics.com',
    phone: '+254 733 456 789',
    project_type: 'Industrial & Warehousing',
    location: 'Tatu City SEZ, Kiambu',
    budget: 'KES 500M - 1B ($4M - $8M USD)',
    preferred_start_date: '2025-05-15',
    description: 'Construction of a 15,000 sqm temperature-controlled agro-processing warehouse with super-flat concrete flooring and solar PV roof installation.',
    status: 'Reviewing',
    admin_notes: 'Preliminary bill of quantities (BOQ) reviewed by Estimator. Awaiting structural steel fabrication quotations.',
    estimated_quote_amount: 'KES 780,000,000',
    created_at: '2024-08-14T09:15:00Z',
    updated_at: '2024-08-14T10:00:00Z'
  }
];

export const INITIAL_CONTACT_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Hon. Peter Mutua',
    email: 'p.mutua@countygov.ke',
    phone: '+254 720 112 233',
    subject: 'Consultation for Municipal Urban Drainage & Road Upgrade Tender',
    message: 'We are inviting pre-qualified NCA-1 civil contractors for an upcoming 24km urban road upgrade and culvert rehabilitation tender in Machakos County. Please confirm availability of your civil works team for pre-bid technical briefing.',
    status: 'unread',
    created_at: '2024-08-16T14:22:00Z',
    updated_at: '2024-08-16T14:22:00Z'
  },
  {
    id: 'msg-2',
    name: 'Linda Cherono',
    email: 'linda.cherono@safariresorts.com',
    phone: '+254 711 998 877',
    subject: 'Request for Luxury Safari Lodge Renovation Proposal',
    message: 'Seeking a seasoned tier-one contractor for the renovation and structural expansion of our 36-key eco-lodge in Maasai Mara. Scope entails sustainable timber work and solar mini-grid.',
    status: 'read',
    created_at: '2024-08-15T08:45:00Z',
    updated_at: '2024-08-15T11:30:00Z'
  }
];
