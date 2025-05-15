import logging

from flask import has_request_context, session

logger = logging.getLogger("DropHiveLogger")
logger.setLevel(logging.INFO)
logger.propagate = False


class MultiCompanyFileHandler(logging.Handler):
    def emit(self, record):
        if has_request_context() and "db.name" in session:
            db_log = f"../log/{session['db.name']}.log"
        else:
            db_log = "../log/DropHive.log"
        log_entry = self.format(record)
        with open(db_log, "a", encoding="utf-8") as f:
            f.write(log_entry + "\n")


class CustomFormatter(logging.Formatter):
    def format(self, record):
        if record.levelno >= logging.ERROR:
            self._style._fmt = ('%(asctime)s - %(levelname)s - %(filename)s - %(funcName)s - [user: %(user)s] - %('
                                'message)s')
        else:
            self._style._fmt = '%(asctime)s - %(levelname)s - [user: %(user)s] - %(message)s'
        return super().format(record)


class ContextFilter(logging.Filter):
    def filter(self, record):
        if has_request_context() and "user" in session:
            record.user = session["user"]
        else:
            record.user = "-"
        return True


handler = MultiCompanyFileHandler()
handler.setLevel(logging.INFO)
handler.setFormatter(CustomFormatter())
handler.addFilter(ContextFilter())
logger.addHandler(handler)
