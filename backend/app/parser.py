import fitz  # PyMuPDF
from docx import Document
import io

class ResumeParser:
    @staticmethod
    def parse_pdf(file_bytes: bytes) -> str:
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text()
            return text
        except Exception as e:
            print(f"PDF Parsing Error: {e}")
            return ""

    @staticmethod
    def parse_docx(file_bytes: bytes) -> str:
        try:
            doc = Document(io.BytesIO(file_bytes))
            return "\n".join([para.text for para in doc.paragraphs])
        except Exception as e:
            print(f"DOCX Parsing Error: {e}")
            return ""

    @classmethod
    def parse(cls, file_bytes: bytes, filename: str) -> str:
        if filename.lower().endswith(".pdf"):
            return cls.parse_pdf(file_bytes)
        elif filename.lower().endswith(".docx"):
            return cls.parse_docx(file_bytes)
        else:
            # Assume text file for other types
            return file_bytes.decode("utf-8", errors="ignore")

parser = ResumeParser()
