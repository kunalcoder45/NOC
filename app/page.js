'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import govtLogo from '@/assets/govtLogo.svg';
import stamp from '@/assets/stamp.png';
import signature from '@/assets/signature.png';

const branchCodes = {
  'Mechanical': 'MECH',
  'Computer Science and Engineering': 'CSE',
  'Civil': 'CIVIL',
  'Electrical': 'EE',
  'ECE': 'ECE'
};

const currentYear = new Date().getFullYear();

// Move counters outside component to persist across renders
const branchCounters = {
  MECH: 1,
  CSE: 1,
  CIVIL: 1,
  EE: 1,
  ECE: 1,
};

// Function to get and increment letter number
const getLetterNumber = (branch, semester) => {
  const branchCode = branchCodes[branch];
  const serial = String(branchCounters[branchCode]).padStart(3, '0');
  const letterNumber = `${branchCode}/${currentYear}/${semester}/${serial}`;
  
  // Increment counter for next use
  branchCounters[branchCode]++;
  
  return letterNumber;
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '32px 0'
  },
  wrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px'
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    marginBottom: '32px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '24px',
    color: '#333'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
    marginBottom: '16px'
  },
  inputGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151'
  },
  input: {
    width: '100%',
    border: '1px solid #d1d5db',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  inputFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  },
  select: {
    width: '100%',
    border: '1px solid #d1d5db',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'white'
  },
  textarea: {
    width: '100%',
    border: '1px solid #d1d5db',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '80px'
  },
  buttonContainer: {
    textAlign: 'center',
    marginTop: '24px'
  },
  button: {
    padding: '12px 32px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  buttonHover: {
    backgroundColor: '#2563eb'
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed'
  },
  previewContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  },
  letterContainer: {
    width: '794px',
    minHeight: 'auto',
    margin: '0 auto',
    padding: '60px 0px 80px 90px', // Increased bottom padding
    fontSize: '14px',
    lineHeight: '1.4',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'white',
    color: 'black',
    position: 'relative',
    overflow: 'visible' // Changed from hidden to visible
  },
  headerContainer: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1px'
  },
  mainTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
    letterSpacing: '0.5px'
  },
  headerText: {
    fontSize: '13px',
    marginBottom: '4px'
  },
  emailLink: {
    color: '#1d4ed8',
    textDecoration: 'underline'
  },
  headerLine: {
    borderTop: '2px solid black',
    marginTop: '12px'
  },
  letterDetailsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px'
  },
  letterDetailItem: {
    fontWeight: 'bold'
  },
  sectionContainer: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  sectionContent: {
    marginLeft: '16px'
  },
  table: {
    width: '100%',
    border: '2px solid black',
    borderCollapse: 'collapse',
    marginBottom: '24px'
  },
  tableHeader: {
    backgroundColor: '#f9f9f9',
    border: '1px solid black',
    padding: '12px',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  tableCell: {
    border: '1px solid black',
    padding: '12px',
    textAlign: 'center'
  },
  signatureContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: '64px'
  },
  signatureRight: {
    textAlign: 'right'
  },
  signatureText: {
    marginBottom: '16px'
  },
  signatureImage: {
    marginBottom: '8px',
  },
  officerTitle: {
    fontWeight: '600'
  }
};

export default function Page() {
  const letterRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    branch: 'Mechanical',
    semester: '4th',
    toField: 'GM,\nBOKARO STEEL LIMITED (BSL),\nBOKARO, Jharkhand.'
  });
  const [letterNumber, setLetterNumber] = useState('');

  const [isHovered, setIsHovered] = useState(false);

  const today = new Date().toLocaleDateString('en-GB');

  const handleDownload = async () => {
    const element = letterRef.current;
    if (!element) return;

    try {
      // Generate letter number only when downloading
      const newLetterNumber = getLetterNumber(formData.branch, formData.semester);
      setLetterNumber(newLetterNumber);

      // Small delay to ensure state update
      setTimeout(async () => {
        element.style.minHeight = '1200px';

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 595.28; // A4 width in pt
        const pageHeight = 841.89; // A4 height in pt

        const originalHeight = (canvas.height * imgWidth) / canvas.width;

        // Calculate scale factor to fit image height within pageHeight
        const scaleFactor = pageHeight / originalHeight;

        const pdf = new jsPDF('p', 'pt', 'a4');

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * scaleFactor, pageHeight);

        pdf.save(`${formData.name}_NOC.pdf`);

        element.style.minHeight = '1123px';

        alert('PDF downloaded successfully!');
      }, 100);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const isFormValid = formData.name.trim() && formData.regNo.trim();

  // Generate preview letter number (without incrementing counter)
  const previewLetterNumber = letterNumber || `${branchCodes[formData.branch]}/${currentYear}/${formData.semester}/XXX`;

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Form Section */}
        <div style={styles.formContainer}>
          <h1 style={styles.title}>NOC Letter Generator</h1>

          <div style={styles.gridContainer}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                style={styles.input}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter student name"
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Registration Number</label>
              <input
                type="text"
                style={styles.input}
                value={formData.regNo}
                onChange={e => setFormData({ ...formData, regNo: e.target.value })}
                placeholder="Enter registration number"
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Branch</label>
              <select
                style={styles.select}
                value={formData.branch}
                onChange={e => setFormData({ ...formData, branch: e.target.value })}
              >
                {Object.keys(branchCodes).map(branch =>
                  <option key={branch} value={branch}>{branch}</option>
                )}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Semester</label>
              <select
                style={styles.select}
                value={formData.semester}
                onChange={e => setFormData({ ...formData, semester: e.target.value })}
              >
                {['1st', '2nd', '3rd', '4th', '5th', '6th'].map(s =>
                  <option key={s} value={s}>{s}</option>
                )}
              </select>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>To (Receiver)</label>
            <textarea
              style={styles.textarea}
              value={formData.toField}
              onChange={e => setFormData({ ...formData, toField: e.target.value })}
              placeholder="Enter receiver details"
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={styles.buttonContainer}>
            <button
              onClick={handleDownload}
              style={{
                ...styles.button,
                ...(isHovered ? styles.buttonHover : {}),
                ...(!isFormValid ? styles.buttonDisabled : {})
              }}
              disabled={!isFormValid}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Letter Preview */}
        <div style={styles.previewContainer}>
          <div id="noc-letter" style={{
            ...styles.letterContainer,
            paddingBottom: '150px',
            overflow: 'visible'
          }}
            ref={letterRef}>
            {/* Header Section */}
            <div style={styles.headerContainer}>
              <div style={styles.logoContainer}>
                <Image src={govtLogo} alt="Government Logo" width={80} height={80} />
              </div>
              <h1 style={styles.mainTitle}>GOVERNMENT POLYTECHNIC, RANCHI</h1>
              <p style={styles.headerText}>Church Road, Ranchi- 834001</p>
              <p style={styles.headerText}>
                Mail-id- <span style={styles.emailLink}>govt_polytechnic_ranchi@yahoo.co.in</span>
              </p>
              <p style={styles.headerText}>(The Department of Higher and Technical Education)</p>
              <p style={{ ...styles.headerText, fontWeight: '600' }}>Under Government of Jharkhand, Ranchi</p>
              <div style={styles.headerLine}></div>
            </div>

            {/* Letter Details */}
            <div style={styles.letterDetailsContainer}>
              <div>
                <p style={styles.letterDetailItem}>Letter No: {previewLetterNumber}</p>
              </div>
              <div>
                <p style={styles.letterDetailItem}>Dated: {today}</p>
              </div>
            </div>

            {/* From Section */}
            <div style={styles.sectionContainer}>
              <p style={styles.sectionTitle}>From,</p>
              <div style={styles.sectionContent}>
                <p>Training and Placement Officer</p>
                <p>Government Polytechnic Ranchi</p>
              </div>
            </div>

            {/* To Section */}
            <div style={styles.sectionContainer}>
              <p style={styles.sectionTitle}>To,</p>
              <div style={styles.sectionContent}>
                <p style={{ whiteSpace: 'pre-line' }}>{formData.toField}</p>
              </div>
            </div>

            {/* Subject */}
            <div style={styles.sectionContainer}>
              <p style={styles.sectionTitle}>Sub: Request for summer vocational / internship of 6 to 8 weeks training of diploma</p>
            </div>

            {/* Body */}
            <div style={styles.sectionContainer}>
              <p style={{ marginBottom: '16px' }}>Sir,</p>
              <p style={{ marginBottom: '16px' }}>
                As per curriculum of Jharkhand University of Technology, every student who is going to {formData.semester} semester has to undergo 6 to 8 weeks in Summer Internship to enhance their skill and knowledge.
              </p>
              <p style={{ marginBottom: '16px' }}>Therefore, kindly permit the following students</p>
            </div>

            {/* Student Table */}
            <div style={styles.sectionContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Name</th>
                    <th style={styles.tableHeader}>Registration No.</th>
                    <th style={styles.tableHeader}>Branch</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.tableCell}>{formData.name}</td>
                    <td style={styles.tableCell}>{formData.regNo}</td>
                    <td style={styles.tableCell}>{formData.branch.toUpperCase()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Closing */}
            <div style={styles.sectionContainer}>
              <p style={{ fontWeight: 'bold', marginBottom: '16px' }}>To undergo summer internship in your esteem organization.</p>
              <p>Thanking you,</p>
            </div>

            {/* Signature Section */}
            <div style={{
              ...styles.signatureContainer,
              position: 'relative',
              marginTop: '40px',
              width: '100%',
              justifyContent: 'space-between'
            }}>
              <div style={{ padding: '10px', width: '100px' }}>
                <img
                  src={stamp.src}
                  alt="Official Stamp"
                  style={{
                    width: '190px',
                    height: '80px',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </div>

              <div style={styles.signatureRight}>
                <p style={styles.signatureText}>Yours faithfully,</p>
                <div style={styles.signatureImage}>
                  <img
                    src={signature.src}
                    alt="Signature"
                    style={{
                      width: '210px',
                      height: '80px',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
                <p style={styles.officerTitle}>Training and Placement Officer</p>
                <p>Government Polytechnic Ranchi.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}