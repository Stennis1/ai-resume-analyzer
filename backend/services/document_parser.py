from io import BytesIO
from pathlib import Path

from docx import Document
from pypdf import PdfReader


SUPPORTED_EXTENSIONS = {".pdf", ".docx"}


def extract_resume_text(file_name: str, file_bytes: bytes) -> str:
    extension = Path(file_name).suffix.lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise ValueError("Only PDF and Word (.docx) files are supported.")

    if not file_bytes:
        raise ValueError("Uploaded resume file is empty.")

    if extension == ".pdf":
        return extract_pdf_text(file_bytes)

    return extract_docx_text(file_bytes)


def extract_pdf_text(file_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(file_bytes))
    text = "\n".join(page.extract_text() or "" for page in reader.pages).strip()

    if not text:
        raise ValueError("Could not extract text from the uploaded PDF.")

    return text


def extract_docx_text(file_bytes: bytes) -> str:
    document = Document(BytesIO(file_bytes))
    text = "\n".join(paragraph.text for paragraph in document.paragraphs).strip()

    if not text:
        raise ValueError("Could not extract text from the uploaded Word document.")

    return text
