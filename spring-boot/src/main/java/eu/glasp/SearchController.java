package eu.glasp;

import eu.glasp.model.Address;
import eu.glasp.model.ApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(maxAge = 3600)
public class SearchController {
    private final ValidationService validationService;

    @Autowired
    public SearchController(ValidationService validationService){
        this.validationService = validationService;
    }

    @PostMapping("/app/search")
    public ResponseEntity<List<Address>> search(@RequestBody Address address) throws IOException, ApiException {
        System.out.println("Search address " + address.toString());
        List<Address> addresses = this.validationService.search(address);

        return ResponseEntity.ok(addresses);
    }
}
