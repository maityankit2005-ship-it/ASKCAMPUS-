const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const FAQ = require('./models/FAQ');

dotenv.config({ path: path.join(__dirname, '.env') });

const sampleFAQs = [
  // Admissions
  {
    question: 'What is the admission process for BTech programs?',
    answer:
      'Admissions for BTech programs are based on state/national entrance exam ranks followed by centralized counseling. Shortlisted students must submit their 10th and 12th mark sheets, transfer certificate, and ID proof at the Admission Cell.',
    category: 'Admissions',
  },
  {
    question: 'What documents are required during college admission?',
    answer:
      'You need to bring original and two photocopies of your 10th & 12th mark sheets, entrance rank card, transfer certificate (TC), migration certificate, passport-size photos, and Aadhaar card.',
    category: 'Admissions',
  },
  // Fees and Scholarships
  {
    question: 'How can I pay my semester tuition fees?',
    answer:
      'Semester fees can be paid online through the Student Portal using UPI, net banking, or debit/credit cards. You can also pay via demand draft at the Accounts Counter between 9:30 AM and 3:30 PM on working days.',
    category: 'Fees and Scholarships',
  },
  {
    question: 'Are merit scholarships available for students?',
    answer:
      'Yes, the college offers merit scholarships to students scoring above 90% in semester exams, as well as government post-matric scholarships for eligible categories. Applications open every September at the Scholarship Desk.',
    category: 'Fees and Scholarships',
  },
  // Examinations
  {
    question: 'What is the passing criteria for semester examinations?',
    answer:
      'Students must score at least 40% in internal assessments and 40% in end-semester university exams separately, with a combined aggregate of 40% to pass a subject.',
    category: 'Examinations',
  },
  {
    question: 'How do I apply for exam revaluation or rechecking?',
    answer:
      'Revaluation forms are available on the Examination Cell portal within 7 days of result declaration. Pay the prescribed fee per subject online and submit the receipt to the Exam Cell.',
    category: 'Examinations',
  },
  // Attendance
  {
    question: 'What is the minimum attendance required to sit for exams?',
    answer:
      'A minimum of 75% attendance in each subject (lectures and labs combined) is mandatory to appear for end-semester examinations. Medical condonation up to 10% may be granted with valid hospital documents.',
    category: 'Attendance',
  },
  {
    question: 'Where can I check my daily attendance record?',
    answer:
      'You can view your subject-wise attendance percentage in real time by logging into the Campus ERP portal under the Attendance tab.',
    category: 'Attendance',
  },
  // Timetables
  {
    question: 'Where can I download my semester class timetable?',
    answer:
      'Departmental class timetables are published on the Notice Board and in the Academics section of the college website one week before classes begin.',
    category: 'Timetables',
  },
  {
    question: 'What are the regular college hours and break timings?',
    answer:
      'Regular classes run from 9:00 AM to 4:15 PM, Monday through Friday, with a 45-minute lunch break from 12:45 PM to 1:30 PM.',
    category: 'Timetables',
  },
  // Placements
  {
    question: 'When do campus placement drives start for final-year students?',
    answer:
      'Campus placement drives begin in the 7th semester (August onwards). Pre-placement training, aptitude workshops, and mock interviews start in the 6th semester.',
    category: 'Placements',
  },
  {
    question: 'What is the eligibility criteria for sitting in campus placements?',
    answer:
      'Most recruiting companies require a minimum CGPA of 6.5 or 60% throughout academics with no active backlogs. Specific criteria vary by company and are shared on the Placement Portal.',
    category: 'Placements',
  },
  // Campus Facilities
  {
    question: 'What are the central library timings and borrowing rules?',
    answer:
      'The Central Library is open from 8:30 AM to 8:00 PM on weekdays and 9:00 AM to 5:00 PM on Saturdays. Students can borrow up to 4 books for 14 days using their student ID card.',
    category: 'Campus Facilities',
  },
  {
    question: 'Is Wi-Fi and hostel accommodation available on campus?',
    answer:
      'Yes, high-speed campus Wi-Fi is free for all registered students. Separate boys and girls hostels with mess, 24/7 security, and study rooms are available on campus.',
    category: 'Campus Facilities',
  },
  // Events
  {
    question: 'How do I register for the annual tech fest and cultural events?',
    answer:
      'Registrations for the annual TechFest and Cultural Fest open on the Student Activities Portal three weeks before the event. Both solo and team registrations are supported.',
    category: 'Events',
  },
  {
    question: 'How can I join student clubs like Coding Club or Robotics Club?',
    answer:
      'Club inductions happen at the start of every odd semester during Club Orientation Week. You can sign up at the respective club booth or through the Student Council page.',
    category: 'Events',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    const adminName = process.env.SEED_ADMIN_NAME || 'Campus Admin';
    const adminEmail = process.env.SEED_ADMIN_EMAIL;
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error(
        'Error: SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env before running seed.'
      );
      process.exit(1);
    }

    // Create admin user if not already present
    let admin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!admin) {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log(`Admin user created: ${admin.email}`);
    } else {
      console.log(`Admin user already exists: ${admin.email}`);
    }

    // Seed FAQs if collection is empty
    const existingCount = await FAQ.countDocuments();
    if (existingCount === 0) {
      const faqsWithAuthor = sampleFAQs.map((faq) => ({
        ...faq,
        createdBy: admin._id,
      }));
      await FAQ.insertMany(faqsWithAuthor);
      console.log(`Seeded ${faqsWithAuthor.length} college FAQs.`);
    } else {
      console.log(`FAQs already exist (${existingCount} found). Skipping FAQ seed.`);
    }

    console.log('Database seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
